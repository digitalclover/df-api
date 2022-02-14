import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { mapDbDataToVideoResponse, getVideoValues, getVideoResponse } from "../utility/getVideoResponse";
import { DBVideo, SearchParams, VideoDetails } from "../utility/interface";

let videoCache: DBVideo[] = [];

const httpTrigger: AzureFunction = function (context: Context, req: HttpRequest) {
  videoCache = !!videoCache.length ? videoCache : context.bindings.inputDocument as DBVideo[];
  setInterval(() => videoCache = [], 60000);
  const { title, tags, date } = req.body as SearchParams;
  const response = videoCache.filter(video => {
    const titleMatch = !!title ? video.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()) || false : true;
    const tagsMatch = !!(tags && tags.length) ? tags.every(tag => video.tags.includes(tag.toLocaleLowerCase())) || false : true;
    const dateMatch = !!date && (!!date.from || !!date.to) ? filterDate(video, date) || false : true;
    return titleMatch && tagsMatch && dateMatch;
  }).map(getVideoValues());

  context.res = {
    body: response
  };
  context.done();

};

export default httpTrigger;

const filterDate = (video: VideoDetails, date: SearchParams['date']) => {
  const fromValue = date?.from || '2010-01-01';
  const toValue = date?.to || Date.now().toString();
  const from = Date.parse(fromValue);
  const to = Date.parse(toValue);
  return video.created >= from && video.created <= to;
}

const refreshCache = () => {

}