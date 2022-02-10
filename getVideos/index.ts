import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = function (context: Context, req: HttpRequest) {
    context.log('HTTP trigger function processed a request.');

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: context.bindings.inputDocument
    };
    context.done();

};

export default httpTrigger;