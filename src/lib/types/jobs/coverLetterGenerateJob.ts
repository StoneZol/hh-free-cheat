import type { ExtensionJobTimestamps } from '@/lib/types/jobs/types'

export type CoverLetterGenerateJob = ExtensionJobTimestamps & {
    vacancyUrl: string
    result?: {
        letter: string
    }
    error?: string
}
