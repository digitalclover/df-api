import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getVideoValues } from '../utility/getVideoResponse';
import { DBVideo } from '../utility/interface';

let videos: DBVideo[] = [];
let cacheReset: NodeJS.Timer;

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  if(!videos.length){
    videos = context.bindings.inputDocument as DBVideo[];
    refreshCache();
  }
  context.res = {
    body: videos.map(getVideoValues()),
  };
};

export default httpTrigger;

const refreshCache = () => {
  !!cacheReset && clearInterval(cacheReset);
  cacheReset = setInterval(() => videos = [], 3600000);
}