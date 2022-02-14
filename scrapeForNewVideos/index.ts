import { AzureFunction, Context } from '@azure/functions';
import * as jsdom from 'jsdom';
import { VideoBasic, VideoDetails } from '../utility/interface';
import { getRequest } from '../utility/requests';

const samplerTitle = 'FREE DOWNLOAD: Gran Turismo Sport HDR Sampler';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any) {
  const homepageDOM = await getRequest();
  const basicList = defineVideoBasicInfo(homepageDOM)
  if (basicList[0].title === samplerTitle) basicList.shift();
  const existing: VideoDetails[] = context.bindings.inputDocument;
  const newVideos = basicList.filter(incoming => !existing.some(e => e.title === incoming.title));
  context.log(`Found ${newVideos.length} new videos`);
  const videos = await Promise.all(newVideos.map(async (video) => {
    const detailsDom = await getRequest(video.dfLink);
    const videoDetails = mapVideoDetails(detailsDom);
    return { ...video, ...videoDetails } as VideoDetails;
  }));
  if (videos.length) {
    context.bindings.outputDocument = JSON.stringify(videos);
  }
};

export default timerTrigger;

const defineVideoBasicInfo = (data: string): VideoBasic[] => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(data);
  const videoDOMs = dom.window.document.getElementsByClassName('video') || [];
  return [...videoDOMs].map(videoEl => {
    const title = videoEl.querySelector('.title')?.textContent?.trim() || '';
    let dfLink =
      videoEl.querySelector('.title a')?.getAttribute('href') || '';
    const duration = videoEl.querySelector('.duration')?.textContent?.trim() || '';
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
  const breadcrumbs = videoDetails?.querySelectorAll('.breadcrumb a') || [];
  const tags = [...breadcrumbs].map(el => el?.textContent?.trim().toLocaleLowerCase());
  const thumbnail = videoDetails?.querySelector('.thumbnails a')?.getAttribute('href');
  const ytLink = videoDetails?.querySelector('iframe')?.getAttribute('data-src')?.replace('https://www.youtube.com/embed/', 'https://youtu.be/') || '';
  const description = videoDetails?.querySelector('.body')?.textContent?.trim() || '';
  const formats = videoDetails?.getElementsByClassName('download-option') || [];
  const downloadOptions = getDownloadOptions([...formats]);
  return { thumbnail, tags, ytLink, created, description, downloadOptions };
};

const getDownloadOptions = (elements: Element[]) => elements.map(el => {
  const format = el.querySelector('.metadata span:first-child')?.textContent?.trim() || '';
  const fileSize = el.querySelector('.size')?.textContent?.trim() || '';
  const videoEncoding = el.querySelector('.video-encoding')?.textContent?.trim() || '';
  const audioEncoding = el.querySelector('.audio-encoding')?.textContent?.trim() || '';
  const videoId = el.querySelector('.download')?.getAttribute('href')?.split('/auth/download/')[1] || '';
  return { format, fileSize, videoEncoding, audioEncoding, videoId };
});