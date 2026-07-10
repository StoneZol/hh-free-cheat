import type { ChatMessage } from '@/lib/types/llm/types'
import type { LastVacancy } from '@/lib/types/vacancy/types'
import type { Resume } from '@/lib/types/resume/types'
import { serializeResumeForPrompt } from './serializeResumeForPrompt'

type BuildCoverLetterMessagesInput = {
    generationPrompt: string
    resume: Resume
    vacancy: LastVacancy | null
}

function buildUserPrompt(resume: Resume, vacancy: LastVacancy | null): string {
    const resumeBlock = `Резюме кандидата:
"""
${serializeResumeForPrompt(resume)}
"""`

    if (!vacancy?.text.trim()) {
        return `${resumeBlock}

Текст вакансии не предоставлен.

${COVER_LETTER_RESUME_ONLY_FOOTER}`
    }

    return `${resumeBlock}

Текст вакансии:
"""
${vacancy.text}
"""

Напиши сопроводительное письмо.
Первой строкой — «Здравствуйте!» (или кодовое слово/ответ, только если вакансия явно требует это в сопроводительном).
Не копируй в письмо заголовки секций вакансии: «Ключевые навыки», «Требования», «Обязанности» и т.п.
Не добавляй в конец имя, подпись, «С уважением» и плейсхолдеры вроде [Имя Кандидата].`
}

const COVER_LETTER_RESUME_ONLY_FOOTER = `Напиши сопроводительное письмо только на основе резюме.
Первой строкой — «Здравствуйте!».
Не добавляй в конец имя, подпись и плейсхолдеры вроде [Имя Кандидата].`

export function buildCoverLetterMessages({
    generationPrompt,
    resume,
    vacancy,
}: BuildCoverLetterMessagesInput): ChatMessage[] {
    const messages: ChatMessage[] = []
    const trimmedPrompt = generationPrompt.trim()

    if (trimmedPrompt) {
        messages.push({
            role: 'developer',
            content: trimmedPrompt,
        })
    }

    messages.push({
        role: 'user',
        content: buildUserPrompt(resume, vacancy),
    })

    return messages
}
