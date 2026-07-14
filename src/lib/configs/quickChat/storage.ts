import type { QuickChatConfig } from '@/lib/types/quickChat/types'

export const DEFAULT_QUICK_CHAT_CONFIG: QuickChatConfig = {
    systemPrompt: `Ты помощник по настройке браузерного расширения для job-сайтов.`,
    maxMessages: 6,
}

const STORAGE_KEY = 'quickChatConfig'

function normalizeMaxMessages(value: unknown): number {
    const parsed = Number(value)

    if (!Number.isFinite(parsed)) {
        return DEFAULT_QUICK_CHAT_CONFIG.maxMessages
    }

    return Math.min(100, Math.max(1, Math.trunc(parsed)))
}

export async function loadQuickChatConfig(): Promise<QuickChatConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<QuickChatConfig> | undefined

    return {
        systemPrompt: storedConfig?.systemPrompt ?? DEFAULT_QUICK_CHAT_CONFIG.systemPrompt,
        maxMessages: normalizeMaxMessages(storedConfig?.maxMessages),
    }
}

export async function saveQuickChatConfig(config: QuickChatConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: {
            ...config,
            maxMessages: normalizeMaxMessages(config.maxMessages),
        },
    })
}

export { STORAGE_KEY as QUICK_CHAT_CONFIG_STORAGE_KEY }
