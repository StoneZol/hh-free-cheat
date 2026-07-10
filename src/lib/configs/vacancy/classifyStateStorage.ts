import type { VacancyClassifyState } from '@/lib/types/vacancy/types'

const STORAGE_KEY = 'vacancyClassifyState'

export const DEFAULT_VACANCY_CLASSIFY_STATE: VacancyClassifyState = {
    status: 'idle',
    url: '',
    message: '',
    updatedAt: '',
}

export async function loadVacancyClassifyState(): Promise<VacancyClassifyState> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedState = result[STORAGE_KEY] as Partial<VacancyClassifyState> | undefined

    return {
        ...DEFAULT_VACANCY_CLASSIFY_STATE,
        ...storedState,
    }
}

export async function saveVacancyClassifyState(state: VacancyClassifyState): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: state,
    })
}

export { STORAGE_KEY as VACANCY_CLASSIFY_STATE_STORAGE_KEY }
