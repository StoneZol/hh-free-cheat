import type { CoverLetterConfig } from '@/lib/types/coverLetter/types'

export const DEFAULT_COVER_LETTER_CONFIG: CoverLetterConfig = {
    generationPrompt: `Ты пишешь сопроводительное письмо для отклика на вакансию.

Стиль и длина:
- Живой, уверенный тон — как письмо реальному рекрутёру.
- Коротко: приветствие + не больше 2 абзацев. Без воды и канцелярита.

Структура (строго):
- Первая строка письма — только «Здравствуйте!» (на языке вакансии).
- Исключение: если вакансия явно просит кодовое слово или ответ в сопроводительном — тогда сначала эта строка, пустая строка, затем «Здравствуйте!».
- Далее 1–2 абзаца по делу.
- Без подписи, имени, контактов и прощания в конце — добавим отдельно.
- Никаких плейсхолдеров: [Имя Кандидата], [Ваше имя], [Name] и т.п.

Запрещено в начале письма:
- Заголовки секций из вакансии: «Ключевые навыки», «Требования», «Обязанности», «Условия», «О компании» и любые подобные.
- Названия навыков отдельной строкой (React, TypeScript, LAN/WLAN и т.п.) — только если вакансия явно не просила это как кодовое слово.
- Любой текст до «Здравствуйте!», кроме явно требуемого кодового слова.

Главное — честный метч:
- Только факты из резюме: «у вас нужно X — у меня есть Y».
- Не выдумывай роль, опыт и обязанности, которых нет в резюме.
- Не упоминай город/регион из вакансии.
- Не называй компанию по имени.
- Без markdown (**жирный**, списки, буллеты).

Язык: как у вакансии; если вакансии нет — как у резюме.

Формат ответа: только текст письма, без пояснений.`,
    letterSignature: `С уважением,
Иван Иванов
+7 (999) 123-45-67
ivan@example.com`,
}

const STORAGE_KEY = 'coverLetterConfig'

type StoredCoverLetterConfig = Partial<CoverLetterConfig> & {
    basePrompt?: string
    generationPromptVersion?: number
}

export async function loadCoverLetterConfig(): Promise<CoverLetterConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as StoredCoverLetterConfig | undefined

    return {
        generationPrompt:
            storedConfig?.generationPrompt ??
            storedConfig?.basePrompt ??
            DEFAULT_COVER_LETTER_CONFIG.generationPrompt,
        letterSignature:
            storedConfig?.letterSignature ?? DEFAULT_COVER_LETTER_CONFIG.letterSignature,
    }
}

export async function saveCoverLetterConfig(config: CoverLetterConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: config,
    })
}

export { STORAGE_KEY as COVER_LETTER_CONFIG_STORAGE_KEY }
