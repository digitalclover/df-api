import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = function (context: Context, req: HttpRequest): void {
    context.log('HTTP trigger function processed a request.');
    const responseMessage = context.bindings.inputDocument

    context.res = {
        body: responseMessage
    };
    context.done();

};

export default httpTrigger;