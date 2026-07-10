import { z } from 'zod'

export const coverLetterConfigSchema = z.object({
    generationPrompt: z.string(),
    letterSignature: z.string(),
})
export type CoverLetterConfig = z.infer<typeof coverLetterConfigSchema>
