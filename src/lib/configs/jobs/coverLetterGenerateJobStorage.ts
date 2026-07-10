import type { CoverLetterGenerateJob } from '@/lib/types/jobs/coverLetterGenerateJob'

const STORAGE_KEY = 'coverLetterGenerateJob'

type EnqueueCoverLetterGenerateJobInput = {
    vacancyUrl: string
}

export async function loadCoverLetterGenerateJob(): Promise<CoverLetterGenerateJob | null> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedJob = result[STORAGE_KEY] as CoverLetterGenerateJob | undefined

    return storedJob ?? null
}

export async function saveCoverLetterGenerateJob(job: CoverLetterGenerateJob): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: job,
    })
}

export async function clearCoverLetterGenerateJob(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY)
}

export async function enqueueCoverLetterGenerateJob({
    vacancyUrl,
}: EnqueueCoverLetterGenerateJobInput): Promise<CoverLetterGenerateJob> {
    const timestamp = new Date().toISOString()
    const job: CoverLetterGenerateJob = {
        jobId: crypto.randomUUID(),
        status: 'pending',
        vacancyUrl,
        requestedAt: timestamp,
        updatedAt: timestamp,
    }

    await saveCoverLetterGenerateJob(job)

    return job
}

export { STORAGE_KEY as COVER_LETTER_GENERATE_JOB_STORAGE_KEY }
