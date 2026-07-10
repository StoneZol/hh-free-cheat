import {
    COVER_LETTER_GENERATE_JOB_STORAGE_KEY,
    loadCoverLetterGenerateJob,
} from '@/lib/configs/jobs/coverLetterGenerateJobStorage'
import { loadResumeParseJob, RESUME_PARSE_JOB_STORAGE_KEY } from '@/lib/configs/jobs/resumeParseJobStorage'
import {
    loadVacancyPageDraft,
    VACANCY_PAGE_DRAFT_STORAGE_KEY,
} from '@/lib/configs/vacancy/draftStorage'
import { processCoverLetterGenerateJob } from '@/lib/coverLetter/processCoverLetterGenerateJob'
import { processResumeParseJob } from '@/lib/resume/processResumeParseJob'
import { scheduleVacancyDraftClassification } from '@/lib/vacancy/processVacancyDraft'
import type { CoverLetterGenerateJob } from '@/lib/types/jobs/coverLetterGenerateJob'
import type { ResumeParseJob } from '@/lib/types/jobs/resumeParseJob'
import type { VacancyPageDraft } from '@/lib/types/vacancy/types'

let isResumeParseProcessing = false
let isCoverLetterGenerating = false

async function handleResumeParseJob(job: ResumeParseJob | null | undefined): Promise<void> {
    if (!job || job.status !== 'pending' || isResumeParseProcessing) {
        return
    }

    isResumeParseProcessing = true

    try {
        await processResumeParseJob(job)
    } finally {
        isResumeParseProcessing = false
    }
}

async function handleCoverLetterGenerateJob(
    job: CoverLetterGenerateJob | null | undefined,
): Promise<void> {
    if (!job || job.status !== 'pending' || isCoverLetterGenerating) {
        return
    }

    isCoverLetterGenerating = true

    try {
        await processCoverLetterGenerateJob(job)
    } finally {
        isCoverLetterGenerating = false
    }
}

function handleVacancyPageDraftChange(draft: VacancyPageDraft | null | undefined): void {
    scheduleVacancyDraftClassification(draft ?? undefined)
}

export function startExtensionJobRouter(): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') {
            return
        }

        if (changes[VACANCY_PAGE_DRAFT_STORAGE_KEY]) {
            handleVacancyPageDraftChange(
                changes[VACANCY_PAGE_DRAFT_STORAGE_KEY].newValue as VacancyPageDraft | undefined,
            )
        }

        if (changes[RESUME_PARSE_JOB_STORAGE_KEY]) {
            void handleResumeParseJob(changes[RESUME_PARSE_JOB_STORAGE_KEY].newValue as ResumeParseJob | undefined)
        }

        if (changes[COVER_LETTER_GENERATE_JOB_STORAGE_KEY]) {
            void handleCoverLetterGenerateJob(
                changes[COVER_LETTER_GENERATE_JOB_STORAGE_KEY].newValue as CoverLetterGenerateJob | undefined,
            )
        }
    })

    void loadResumeParseJob().then((job) => handleResumeParseJob(job))
    void loadCoverLetterGenerateJob().then((job) => handleCoverLetterGenerateJob(job))
    void loadVacancyPageDraft().then((draft) => handleVacancyPageDraftChange(draft))
}
