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

${COVER_LETTER_TASK_FOOTER}`
    }

    return `${resumeBlock}

Текст вакансии:
"""
${vacancy.text}
"""

${COVER_LETTER_TASK_FOOTER}`
}

const COVER_LETTER_TASK_FOOTER =
    'Напиши сопроводительное письмо по инструкциям выше. Язык письма — как у основной части текста вакансии; если вакансии нет — как у резюме.'

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
