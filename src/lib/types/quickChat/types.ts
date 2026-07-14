import { z } from 'zod'

export const quickChatConfigSchema = z.object({
    systemPrompt: z.string(),
    maxMessages: z.number().int().min(1).max(100),
})
export type QuickChatConfig = z.infer<typeof quickChatConfigSchema>
