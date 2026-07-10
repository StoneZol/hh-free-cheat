import { useCallback, useEffect, useMemo, useState } from 'react'
import { saveAppStatus } from '@/lib/configs/app/statusStorage'
import {
    clearCoverLetterGenerateJob,
    COVER_LETTER_GENERATE_JOB_STORAGE_KEY,
    enqueueCoverLetterGenerateJob,
} from '@/lib/configs/jobs/coverLetterGenerateJobStorage'
import { watchExtensionJob } from '@/lib/extension/watchExtensionJob'
import type { CoverLetterGenerateJob } from '@/lib/types/jobs/coverLetterGenerateJob'
import { fillVacancyLetterInput } from '../../vacancyLetterInput'

const useGenerateCoverLetterHook = () => {
    const [isGenerating, setIsGenerating] = useState(false)

    const jobWatcher = useMemo(
        () =>
            watchExtensionJob<
                NonNullable<CoverLetterGenerateJob['result']>,
                CoverLetterGenerateJob
            >({
                storageKey: COVER_LETTER_GENERATE_JOB_STORAGE_KEY,
                onProcessing: async () => {
                    setIsGenerating(true)
                    await saveAppStatus({
                        message: 'Генерирую сопроводительное через LLM...',
                        type: 'loading',
                    })
                },
                onDone: async (_job, result) => {
                    const isFilled = fillVacancyLetterInput(result.letter)

                    if (!isFilled) {
                        await saveAppStatus({
                            message:
                                'Сопроводительное сгенерировано, но не удалось вставить текст в поле на странице.',
                            type: 'error',
                        })
                        setIsGenerating(false)
                        await clearCoverLetterGenerateJob()
                        return
                    }

                    await saveAppStatus({
                        message: 'Сопроводительное сгенерировано и вставлено в поле.',
                        type: 'success',
                    })
                    setIsGenerating(false)
                    await clearCoverLetterGenerateJob()
                },
                onError: async (_job, error) => {
                    await saveAppStatus({
                        message: error,
                        type: 'error',
                    })
                    setIsGenerating(false)
                    await clearCoverLetterGenerateJob()
                },
            }),
        [],
    )

    useEffect(() => jobWatcher.subscribe(), [jobWatcher])

    const handleGenerateCoverLetter = useCallback(async () => {
        if (isGenerating) {
            return
        }

        setIsGenerating(true)
        await saveAppStatus({
            message: 'Отправляю задачу на генерацию сопроводительного...',
            type: 'loading',
        })

        try {
            const job = await enqueueCoverLetterGenerateJob({
                vacancyUrl: window.location.href,
            })

            jobWatcher.trackJob(job.jobId)
        } catch (error: unknown) {
            await saveAppStatus({
                message: error instanceof Error ? error.message : 'Не удалось поставить задачу в очередь.',
                type: 'error',
            })
            setIsGenerating(false)
        }
    }, [isGenerating, jobWatcher])

    return {
        handleGenerateCoverLetter,
        isGenerating,
    }
}

export default useGenerateCoverLetterHook
