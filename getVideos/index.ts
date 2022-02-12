import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { DBVideo } from '../utility/interface';

const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): void {
  context.log('HTTP trigger function processed a request.');
  const dbData: DBVideo[] = context.bindings.inputDocument;
  const responseMessage = dbData.map(video => {
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
    } = video;
    return {
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
  });
  context.res = {
    body: responseMessage,
  };
  context.done();
};

export default httpTrigger;
