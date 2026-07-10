import { saveAppStatus } from '@/lib/configs/app/statusStorage'
import {
    saveVacancyClassifyState,
    VACANCY_CLASSIFY_STATE_STORAGE_KEY,
} from '@/lib/configs/vacancy/classifyStateStorage'
import { saveLastVacancy } from '@/lib/configs/vacancy/lastVacancyStorage'
import { classifyVacancyWithLlm } from '@/lib/vacancy/classifyVacancyWithLlm'
import { isVacancyTextSufficient } from '@/lib/vacancy/vacancyDraftGuards'
import type { VacancyPageDraft } from '@/lib/types/vacancy/types'

let lastProcessedFingerprint = ''
let isClassifying = false
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function buildDraftFingerprint(draft: VacancyPageDraft): string {
    return `${draft.url}::${draft.text}`
}

async function processVacancyDraft(draft: VacancyPageDraft): Promise<void> {
    const fingerprint = buildDraftFingerprint(draft)

    if (!isVacancyTextSufficient(draft.text) || fingerprint === lastProcessedFingerprint || isClassifying) {
        return
    }

    isClassifying = true

    const timestamp = new Date().toISOString()

    await saveVacancyClassifyState({
        status: 'classifying',
        url: draft.url,
        message: 'Проверяю, является ли текст вакансией...',
        updatedAt: timestamp,
    })
    await saveAppStatus({
        message: 'Проверяю вакансию через LLM...',
        type: 'loading',
    })

    try {
        const classification = await classifyVacancyWithLlm(draft.text)

        if (!classification.isVacancy) {
            lastProcessedFingerprint = fingerprint
            await saveVacancyClassifyState({
                status: 'rejected',
                url: draft.url,
                message: 'LLM решила, что это не вакансия.',
                updatedAt: new Date().toISOString(),
            })
            await saveAppStatus({
                message: 'Текст не похож на вакансию. Последняя вакансия не обновлена.',
                type: 'error',
            })
            return
        }

        await saveLastVacancy({
            url: draft.url,
            title: draft.pageTitle?.trim() || 'Вакансия',
            text: draft.text,
            confirmedAt: new Date().toISOString(),
        })

        lastProcessedFingerprint = fingerprint

        await saveVacancyClassifyState({
            status: 'confirmed',
            url: draft.url,
            message: 'Вакансия подтверждена и сохранена.',
            updatedAt: new Date().toISOString(),
        })
        await saveAppStatus({
            message: 'Вакансия подтверждена и сохранена как последняя.',
            type: 'success',
        })
    } catch (error: unknown) {
        await saveVacancyClassifyState({
            status: 'error',
            url: draft.url,
            message: error instanceof Error ? error.message : 'Не удалось проверить вакансию.',
            updatedAt: new Date().toISOString(),
        })
        await saveAppStatus({
            message: error instanceof Error ? error.message : 'Не удалось проверить вакансию.',
            type: 'error',
        })
    } finally {
        isClassifying = false
    }
}

export function scheduleVacancyDraftClassification(
    draft: VacancyPageDraft | null | undefined,
): void {
    if (!isVacancyTextSufficient(draft?.text)) {
        return
    }

    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
        void processVacancyDraft(draft)
    }, 400)
}

export { VACANCY_CLASSIFY_STATE_STORAGE_KEY }
