import type { LastVacancy } from '@/lib/types/vacancy/types'

const STORAGE_KEY = 'lastVacancy'

export async function loadLastVacancy(): Promise<LastVacancy | null> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedVacancy = result[STORAGE_KEY] as LastVacancy | undefined

    return storedVacancy ?? null
}

export async function saveLastVacancy(vacancy: LastVacancy): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: vacancy,
    })
}

export async function clearLastVacancy(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY)
}

export async function getLastVacancyForGeneration(): Promise<LastVacancy | null> {
    return loadLastVacancy()
}

export { STORAGE_KEY as LAST_VACANCY_STORAGE_KEY }
