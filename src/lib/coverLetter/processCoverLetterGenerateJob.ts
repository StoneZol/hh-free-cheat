import { saveCoverLetterGenerateJob } from '@/lib/configs/jobs/coverLetterGenerateJobStorage'
import { getSelectedResumeForGeneration } from '@/lib/configs/resume/storage'
import type { CoverLetterGenerateJob } from '@/lib/types/jobs/coverLetterGenerateJob'
import { resolveVacancyForGeneration } from '@/lib/vacancy/resolveVacancyForGeneration'
import { generateCoverLetterWithLlm } from './generateCoverLetterWithLlm'

export async function processCoverLetterGenerateJob(
    job: CoverLetterGenerateJob,
): Promise<CoverLetterGenerateJob> {
    const processingJob: CoverLetterGenerateJob = {
        ...job,
        status: 'processing',
        updatedAt: new Date().toISOString(),
    }

    await saveCoverLetterGenerateJob(processingJob)

    try {
        const [resume, vacancy] = await Promise.all([
            getSelectedResumeForGeneration(),
            resolveVacancyForGeneration(job.vacancyUrl),
        ])

        if (!resume) {
            throw new Error('Выберите резюме в sidepanel перед генерацией сопроводительного.')
        }

        if (!vacancy) {
            throw new Error('Вакансия не синхронизирована. Откройте страницу вакансии и подождите парсинг.')
        }

        const letter = await generateCoverLetterWithLlm({
            resume,
            vacancy,
        })

        const doneJob: CoverLetterGenerateJob = {
            ...processingJob,
            status: 'done',
            updatedAt: new Date().toISOString(),
            result: {
                letter,
            },
        }

        await saveCoverLetterGenerateJob(doneJob)

        return doneJob
    } catch (error: unknown) {
        const errorJob: CoverLetterGenerateJob = {
            ...processingJob,
            status: 'error',
            updatedAt: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Не удалось сгенерировать сопроводительное.',
        }

        await saveCoverLetterGenerateJob(errorJob)

        return errorJob
    }
}
