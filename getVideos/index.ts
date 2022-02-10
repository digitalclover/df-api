import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = function (context: Context) {
    context.log('HTTP trigger function processed a request.');

    context.res = {
        body: context.bindings.inputDocument
    };
    context.done();

};

export default httpTrigger;