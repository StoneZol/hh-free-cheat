import type { VacancyPageDraft } from '@/lib/types/vacancy/types'

const MIN_VACANCY_TEXT_LENGTH = 80

export function isVacancyTextSufficient(text: string | null | undefined): text is string {
    return Boolean(text && text.trim().length >= MIN_VACANCY_TEXT_LENGTH)
}

export function shouldKeepPreviousVacancyDraft(
    url: string,
    newText: string,
    existingDraft: VacancyPageDraft | null,
): boolean {
    if (!existingDraft || existingDraft.url !== url) {
        return false
    }

    return newText.length < existingDraft.text.length * 0.6
}
