import { title } from 'process'
import * as z from 'zod'

export const PostSchema = z.object({
    title: z.string().min(5 , {message:"Include At Leaset 5 Characters"}).max(500 , {message:"Title is too long"}),
    content: z.string().min(5 , {message:"Content too Short"}).max(5000 , {message:"Content too Long"}),
    authorEmail: z.string().email().nullable(),
    category : z.string({message : "Please Select a Category"}),
    media: z.string().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date())

})