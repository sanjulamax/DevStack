import * as z from 'zod'

export const UserSchema = z.object({
   
    username: z.string().nullable(), // Changed from userName to username to match Prisma schema
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    role: z.enum(['USER', 'ADMIN']).default('USER'),
    birthday: z.string().nullable(), // Changed to date type
    bio: z.string().nullable(),
    profilePicture: z.string().nullable(),
    carierPaths: z.string(),
    workingPlace: z.string().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date())
})