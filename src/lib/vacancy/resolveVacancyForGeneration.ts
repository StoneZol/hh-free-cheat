import { isVacancyParsePage } from '@/lib/configs/content/config'
import { loadContentConfig } from '@/lib/configs/content/storage'
import { loadVacancyPageDraft } from '@/lib/configs/vacancy/draftStorage'
import { loadLastVacancy } from '@/lib/configs/vacancy/lastVacancyStorage'
import { isSamePageUrl } from '@/lib/helpers/isSamePageUrl'
import type { LastVacancy, VacancyPageDraft } from '@/lib/types/vacancy/types'
import { isVacancyTextSufficient } from './vacancyDraftGuards'

function draftToLastVacancy(draft: VacancyPageDraft): LastVacancy {
    return {
        url: draft.url,
        title: draft.pageTitle?.trim() || 'Вакансия',
        text: draft.text,
        confirmedAt: draft.updatedAt,
    }
}

export async function resolveVacancyForGeneration(requestUrl: string): Promise<LastVacancy | null> {
    const [draft, lastVacancy, contentConfig] = await Promise.all([
        loadVacancyPageDraft(),
        loadLastVacancy(),
        loadContentConfig(),
    ])

    if (draft && isSamePageUrl(draft.url, requestUrl)) {
        return draftToLastVacancy(draft)
    }

    if (lastVacancy && isSamePageUrl(lastVacancy.url, requestUrl)) {
        return lastVacancy
    }

    if (!isVacancyParsePage(requestUrl, contentConfig)) {
        if (draft && isVacancyTextSufficient(draft.text)) {
            return draftToLastVacancy(draft)
        }

        return lastVacancy
    }

    return null
}
