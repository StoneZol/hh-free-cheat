import { SYNC_VACANCY_DRAFT_MESSAGE } from '@/lib/extension/contentMessages'
import { isResumePage, isVacancyPage } from '@/lib/hh/page'
import { initContentConfig } from './contentConfigRuntime'
import {
    mountResumeScenario,
    mountVacancyResponseScenario,
    unmountVacancyResponseScenario,
} from './scenarios'
import {
    forceSyncVacancyPageDraft,
    syncVacancyPageDraftForUrl,
    watchVacancyPageDraftVisibility,
} from './syncVacancyPageDraft'
import { watchUrlChanges } from './watchUrlChanges'

function syncContentScenarios(url: string): void {
    syncVacancyPageDraftForUrl(url)

    if (isResumePage(url)) {
        mountResumeScenario()
    }

    if (isVacancyPage(url)) {
        mountVacancyResponseScenario()
        return
    }

    unmountVacancyResponseScenario()
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== SYNC_VACANCY_DRAFT_MESSAGE) {
        return
    }

    void forceSyncVacancyPageDraft().then(() => {
        sendResponse({ ok: true })
    })

    return true
})

void initContentConfig().then(() => {
    watchVacancyPageDraftVisibility()
    syncContentScenarios(window.location.href)
    watchUrlChanges(syncContentScenarios)
})
