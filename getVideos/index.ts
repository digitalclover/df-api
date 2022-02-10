import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { VideoDetails } from '../scrapeForNewVideos';

interface DBVideo extends VideoDetails {
  id: string;
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
}

const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): void {
  context.log('HTTP trigger function processed a request.');
  const dbData: DBVideo = context.bindings.inputDocument;
  const {
    id,
    title,
    duration,
    dfLink,
    ytLink,
    description,
    tags,
    downloadOptions,
    created,
  } = dbData;
  const responseMessage = {
    id,
    title,
    duration,
    dfLink,
    ytLink,
    description,
    tags,
    downloadOptions,
    created,
  };
  context.res = {
    body: responseMessage,
  };
  context.done();
};

export default httpTrigger;
