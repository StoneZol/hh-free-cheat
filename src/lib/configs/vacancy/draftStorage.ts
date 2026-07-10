import type { VacancyPageDraft } from '@/lib/types/vacancy/types'

const STORAGE_KEY = 'vacancyPageDraft'

export async function loadVacancyPageDraft(): Promise<VacancyPageDraft | null> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedDraft = result[STORAGE_KEY] as VacancyPageDraft | undefined

    return storedDraft ?? null
}

export async function saveVacancyPageDraft(draft: VacancyPageDraft): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: draft,
    })
}

export async function clearVacancyPageDraft(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY)
}

export { STORAGE_KEY as VACANCY_PAGE_DRAFT_STORAGE_KEY }
