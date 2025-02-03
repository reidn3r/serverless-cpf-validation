import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { payloadSchema } from "../@types/payload-schema";
import { validate } from "../utils/validate";
import { ResponseType } from "../@types/response-type";

export async function validateCPF(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Validação: Iniciando - "${request.url}"`);
    try{
        const body = await request.json();
        const validatedBody = payloadSchema.safeParse(body);
        if(validatedBody.error){
            return {
            status: 400,
            jsonBody: {
                message: validatedBody.error.errors,
                isValid: false
                }
            }
        }

        const isValid:boolean = validate(validatedBody.data?.cpf);
        const response:ResponseType = {
            message: "ok",
            isValid
        }
        
        context.log(`Validação: Fim - "${request.url} - ${validatedBody.data.cpf} - ${isValid}"`);
        return { 
            status: 200,
            jsonBody: response
        }
    }catch(err:any){
        context.log(`Validação: Erro - ${err}`);
        return {
            status: 500,
            jsonBody: {
                message: err instanceof Error ? err.message : "Erro interno do servidor",
                isValid: false
            }
        }
        
    }
};

app.http('validateCPF', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: validateCPF
});
