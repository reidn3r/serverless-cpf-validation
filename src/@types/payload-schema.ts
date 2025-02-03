import { z } from 'zod';

export const payloadSchema = z.object({
    cpf: z.string().refine((val) => val !== undefined && val !== null, {
        message: "Informe o cpf"
    }).refine((val) => val.length === 11, {
        message: "cpf deve conter 11 dígitos"
    })
})
