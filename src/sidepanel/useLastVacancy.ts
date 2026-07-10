import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    loadVacancyPageDraft,
    VACANCY_PAGE_DRAFT_STORAGE_KEY,
} from '@/lib/configs/vacancy/draftStorage'
import {
    LAST_VACANCY_STORAGE_KEY,
    loadLastVacancy,
} from '@/lib/configs/vacancy/lastVacancyStorage'
import {
    loadVacancyClassifyState,
    VACANCY_CLASSIFY_STATE_STORAGE_KEY,
} from '@/lib/configs/vacancy/classifyStateStorage'
import { SYNC_VACANCY_DRAFT_MESSAGE } from '@/lib/extension/contentMessages'
import { isVacancyParseTab } from '@/lib/hh/page'
import type { LastVacancy, VacancyClassifyState, VacancyPageDraft } from '@/lib/types/vacancy/types'

export type LastVacancyDisplay =
    | {
          mode: 'confirmed'
          title: string
          url: string
          text: string
          confirmedAt: string
      }
    | {
          mode: 'draft'
          title: string
          url: string
          text: string
          statusMessage: string
      }
    | {
          mode: 'loading'
          url: string
      }

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    return activeTab
}

function isSamePageUrl(left: string, right: string): boolean {
    if (!left || !right) {
        return false
    }

    try {
        return new URL(left).href === new URL(right).href
    } catch {
        return left === right
    }
}

async function requestActiveTabVacancySync(): Promise<void> {
    const activeTab = await getActiveTab()

    if (!activeTab?.id || !isVacancyParseTab(activeTab.url ?? '')) {
        return
    }

    try {
        await chrome.tabs.sendMessage(activeTab.id, {
            type: SYNC_VACANCY_DRAFT_MESSAGE,
        })
    } catch {
        // Content script may not be injected on this tab yet.
    }
}

function buildDraftStatusMessage(
    classifyState: VacancyClassifyState | null,
    isClassifying: boolean,
): string {
    if (isClassifying) {
        return 'Проверяю через LLM, является ли это вакансией...'
    }

    return classifyState?.message || 'Ожидаю автоматическую проверку через LLM.'
}

export function useLastVacancy() {
    const [lastVacancy, setLastVacancy] = useState<LastVacancy | null>(null)
    const [vacancyDraft, setVacancyDraft] = useState<VacancyPageDraft | null>(null)
    const [classifyState, setClassifyState] = useState<VacancyClassifyState | null>(null)
    const [activeTabUrl, setActiveTabUrl] = useState('')

    const refreshVacancyState = useCallback(async () => {
        await requestActiveTabVacancySync()

        const [loadedLastVacancy, loadedDraft, loadedClassifyState, activeTab] = await Promise.all([
            loadLastVacancy(),
            loadVacancyPageDraft(),
            loadVacancyClassifyState(),
            getActiveTab(),
        ])

        setLastVacancy(loadedLastVacancy)
        setVacancyDraft(loadedDraft)
        setClassifyState(loadedClassifyState)
        setActiveTabUrl(activeTab?.url ?? '')
    }, [])

    useEffect(() => {
        void refreshVacancyState()

        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local') {
                return
            }

            if (
                changes[LAST_VACANCY_STORAGE_KEY] ||
                changes[VACANCY_PAGE_DRAFT_STORAGE_KEY] ||
                changes[VACANCY_CLASSIFY_STATE_STORAGE_KEY]
            ) {
                void refreshVacancyState()
            }
        }

        function handleTabActivity() {
            void refreshVacancyState()
        }

        chrome.storage.onChanged.addListener(handleStorageChange)
        chrome.tabs.onActivated.addListener(handleTabActivity)
        chrome.tabs.onUpdated.addListener(handleTabActivity)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
            chrome.tabs.onActivated.removeListener(handleTabActivity)
            chrome.tabs.onUpdated.removeListener(handleTabActivity)
        }
    }, [refreshVacancyState])

    const activeDraft = useMemo(() => {
        if (!vacancyDraft || !isSamePageUrl(vacancyDraft.url, activeTabUrl)) {
            return null
        }

        return vacancyDraft
    }, [activeTabUrl, vacancyDraft])

    const activeClassifyState = useMemo(() => {
        if (!classifyState?.url || !isSamePageUrl(classifyState.url, activeTabUrl)) {
            return null
        }

        return classifyState
    }, [activeTabUrl, classifyState])

    const isClassifying = activeClassifyState?.status === 'classifying'
    const isActiveVacancyParseTab = isVacancyParseTab(activeTabUrl)

    const displayVacancy = useMemo((): LastVacancyDisplay | null => {
        if (isActiveVacancyParseTab) {
            if (lastVacancy && isSamePageUrl(lastVacancy.url, activeTabUrl)) {
                return {
                    mode: 'confirmed',
                    title: lastVacancy.title,
                    url: lastVacancy.url,
                    text: lastVacancy.text,
                    confirmedAt: lastVacancy.confirmedAt,
                }
            }

            if (activeDraft) {
                return {
                    mode: 'draft',
                    title: activeDraft.pageTitle?.trim() || 'Вакансия',
                    url: activeDraft.url,
                    text: activeDraft.text,
                    statusMessage: buildDraftStatusMessage(activeClassifyState, isClassifying),
                }
            }

            return {
                mode: 'loading',
                url: activeTabUrl,
            }
        }

        if (lastVacancy) {
            return {
                mode: 'confirmed',
                title: lastVacancy.title,
                url: lastVacancy.url,
                text: lastVacancy.text,
                confirmedAt: lastVacancy.confirmedAt,
            }
        }

        return null
    }, [
        activeClassifyState,
        activeDraft,
        activeTabUrl,
        isActiveVacancyParseTab,
        isClassifying,
        lastVacancy,
    ])

    return {
        displayVacancy,
        isClassifying,
    }
}
