import { INTERNAL_VACANCY_CLASSIFICATION_CONFIG } from '@/lib/configs/internal/vacancyClassification'
import type { ChatMessage } from '@/lib/types/llm/types'

export function buildVacancyClassificationMessages(vacancyText: string): ChatMessage[] {
    return [
        {
            role: 'developer',
            content: INTERNAL_VACANCY_CLASSIFICATION_CONFIG.systemPrompt,
        },
        {
            role: 'user',
            content: `Текст для проверки:
"""
${vacancyText}
"""`,
        },
    ]
}
