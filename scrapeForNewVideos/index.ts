import { AzureFunction, Context } from '@azure/functions';
import * as jsdom from 'jsdom';
import { concatMap, from, map, tap, toArray } from 'rxjs';
import { VideoBasic, VideoDetails } from '../utility/interface';
import { getRequest } from '../utility/requests';

const samplerTitle = 'FREE DOWNLOAD: Gran Turismo Sport HDR Sampler';

const timerTrigger: AzureFunction = function (context: Context, myTimer: any) {
  context.log('Triggering Request');
  const basicList$ = from(getRequest<string>());
  basicList$
    .pipe(
      map(dom => defineVideoBasicInfo(dom)),
      tap(videos =>
        videos[0].title === samplerTitle ? videos.shift() : videos
      ),
      map(videos => {
        const existing: VideoDetails[] = context.bindings.inputDocument;
        const names = existing.map(item => item.title);
        return videos.filter(video => !names.includes(video.title));
      }),
      tap(videos => context.log(`Found ${videos.length} new videos.`)),
      concatMap(videos =>
        from(videos).pipe(
          concatMap(video =>
            from(getRequest<string>(video.dfLink)).pipe(
              map(dom => mapVideoDetails(dom)),
              map(details => ({ ...video, ...details } as VideoDetails)),
              tap(video => context.log(`Found details for ${video.title}`))
            )
          ),
          toArray()
        )
      ),
      tap(data => {
        if (data.length) {
          context.bindings.outputDocument = JSON.stringify(data);
        }
      }),
      tap(data => context.log(JSON.stringify(data))),
      tap(_ => context.done())
    )
    .subscribe();
};

export default timerTrigger;

const defineVideoBasicInfo = (data: string): VideoBasic[] => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(data);
  const videoDOMs = dom.window.document.getElementsByClassName('video') || [];
  return [...videoDOMs].map(videoEl => {
    const title = videoEl.querySelector('.title')?.textContent.trim() || null;
    let dfLink =
      videoEl.querySelector('.title a')?.getAttribute('href') || null;
    const duration = videoEl.querySelector('.duration')?.textContent.trim() || null;
    if (dfLink.substring(0, 1) !== '/') {
      dfLink = `/${dfLink}`
    }
    return {
      title,
      dfLink,
      duration,
    };
  });
};

const mapVideoDetails = (data: string) => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(data);
  const created = Date.now();
  const videoDetails = dom.window.document.querySelector('.video-details');
  const breadcrumbs = videoDetails.querySelectorAll('.breadcrumb a') || [];
  const tags = [...breadcrumbs].map(el => el?.textContent.trim());
  const thumbnail = videoDetails.querySelector('.thumbnails a').getAttribute('href');
  const ytLink = videoDetails.querySelector('iframe')?.getAttribute('data-src')?.replace('https://www.youtube.com/embed/', 'https://youtu.be/') || null;
  const description = videoDetails.querySelector('.body')?.textContent.trim() || null;
  const formats = videoDetails.getElementsByClassName('download-option') || [];
  const downloadOptions = [...formats].map(el => {
    const format = el.querySelector('.metadata span:first-child')?.textContent.trim() || null;
    const fileSize = el.querySelector('.size')?.textContent.trim() || null;
    const videoEncoding = el.querySelector('.video-encoding')?.textContent.trim() || null;
    const audioEncoding = el.querySelector('.audio-encoding')?.textContent.trim() || null;
    const videoId = el.querySelector('.download').getAttribute('href').split('/auth/download/')[1];
    return { format, fileSize, videoEncoding, audioEncoding, videoId };
  });
  return { thumbnail, tags, ytLink, created, description, downloadOptions };
};
