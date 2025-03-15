import * as z from 'zod'

export const ReplySchema = z.object({
    content: z.string().min(5).max(1000),
    authorEmail: z.string().email().nullable(),
    psotId: z.string().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date())
})