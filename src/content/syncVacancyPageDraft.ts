import { saveVacancyPageDraft } from '@/lib/configs/vacancy/draftStorage'
import { isVacancyParsePage } from '@/lib/configs/content/config'
import { getContentConfig } from './contentConfigRuntime'
import { extractVacancyText } from './vacancyPage'

let draftObserver: MutationObserver | null = null
let observedUrl = ''
let lastSavedFingerprint = ''
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null
let isVisibilityWatcherStarted = false

function buildDraftFingerprint(url: string, text: string): string {
    return `${url}::${text}`
}

async function syncVacancyPageDraftOnce(url: string, force = false): Promise<void> {
    if (!isVacancyParsePage(url, getContentConfig())) {
        return
    }

    const vacancyText = extractVacancyText()

    if (!vacancyText) {
        return
    }

    const fingerprint = buildDraftFingerprint(url, vacancyText)

    if (!force && fingerprint === lastSavedFingerprint) {
        return
    }

    lastSavedFingerprint = fingerprint

    await saveVacancyPageDraft({
        url,
        pageTitle: document.title,
        text: vacancyText,
        updatedAt: new Date().toISOString(),
    })
}

function stopDraftObserver(): void {
    draftObserver?.disconnect()
    draftObserver = null
    observedUrl = ''

    if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer)
        syncDebounceTimer = null
    }
}

function scheduleDraftSync(url: string): void {
    if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer)
    }

    syncDebounceTimer = setTimeout(() => {
        void syncVacancyPageDraftOnce(url)
    }, 300)
}

function startDraftObserver(url: string): void {
    if (draftObserver && observedUrl === url) {
        return
    }

    stopDraftObserver()
    observedUrl = url

    draftObserver = new MutationObserver(() => {
        scheduleDraftSync(observedUrl)
    })

    draftObserver.observe(document.body, {
        childList: true,
        subtree: true,
    })
}

export function syncVacancyPageDraftForUrl(url: string): void {
    if (!isVacancyParsePage(url, getContentConfig())) {
        stopDraftObserver()
        lastSavedFingerprint = ''
        return
    }

    void syncVacancyPageDraftOnce(url)
    startDraftObserver(url)
}

export async function forceSyncVacancyPageDraft(): Promise<void> {
    const url = window.location.href

    if (!isVacancyParsePage(url, getContentConfig())) {
        return
    }

    await syncVacancyPageDraftOnce(url, true)
    startDraftObserver(url)
}

export function watchVacancyPageDraftVisibility(): void {
    if (isVisibilityWatcherStarted) {
        return
    }

    isVisibilityWatcherStarted = true

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') {
            return
        }

        void forceSyncVacancyPageDraft()
    })
}
