import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const responseMessage = context.bindings.inputDocument

    context.res = {
        body: responseMessage
    };

};

export default httpTrigger;