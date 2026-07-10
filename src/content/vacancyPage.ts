import { getContentConfig } from './contentConfigRuntime'
import {
    getVacancyContentElementFromConfig,
    hasVacancyParseContentSelectors,
    isVacancyParsePage,
} from '@/lib/configs/content/config'

export function isCurrentVacancyParsePage(): boolean {
    return isVacancyParsePage(window.location.href, getContentConfig())
}

export function getVacancyContentElement(): HTMLElement | null {
    return getVacancyContentElementFromConfig(window.location.href, getContentConfig())
}

export function isVacancyParseContentAnchorConfigured(): boolean {
    return hasVacancyParseContentSelectors(window.location.href, getContentConfig())
}

export function extractVacancyText(): string | null {
    const vacancyContentElement = getVacancyContentElement()

    if (!vacancyContentElement) {
        return null
    }

    const normalizedText = vacancyContentElement.innerText
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n')

    return normalizedText || null
}
