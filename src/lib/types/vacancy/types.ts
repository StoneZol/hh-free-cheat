import { z } from 'zod'

export const vacancyPageDraftSchema = z.object({
    url: z.string(),
    pageTitle: z.string().optional(),
    text: z.string(),
    updatedAt: z.string(),
})
export type VacancyPageDraft = z.infer<typeof vacancyPageDraftSchema>

export const lastVacancySchema = z.object({
    url: z.string(),
    title: z.string(),
    text: z.string(),
    confirmedAt: z.string(),
})
export type LastVacancy = z.infer<typeof lastVacancySchema>

export const vacancyClassifyStatusSchema = z.enum([
    'idle',
    'classifying',
    'confirmed',
    'rejected',
    'error',
])
export type VacancyClassifyStatus = z.infer<typeof vacancyClassifyStatusSchema>

export const vacancyClassifyStateSchema = z.object({
    status: vacancyClassifyStatusSchema,
    url: z.string(),
    message: z.string().optional(),
    updatedAt: z.string(),
})
export type VacancyClassifyState = z.infer<typeof vacancyClassifyStateSchema>

export const vacancyClassificationResultSchema = z.object({
    isVacancy: z.boolean(),
})
export type VacancyClassificationResult = z.infer<typeof vacancyClassificationResultSchema>
