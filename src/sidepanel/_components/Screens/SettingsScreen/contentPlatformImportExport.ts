import { contentPlatformSchema, type ContentPlatform } from '@/lib/types/content/types'
import { APP_SLUG, LEGACY_APP_SLUG } from '@/lib/constants/appName'

export const CONTENT_PLATFORM_EXPORT_TYPE = `${APP_SLUG}-content-platform` as const
export const LEGACY_CONTENT_PLATFORM_EXPORT_TYPE = `${LEGACY_APP_SLUG}-content-platform` as const

export type ContentPlatformExport = {
    type: typeof CONTENT_PLATFORM_EXPORT_TYPE
    version: 1
    platform: ContentPlatform
}

export function serializeContentPlatform(platform: ContentPlatform): string {
    const payload: ContentPlatformExport = {
        type: CONTENT_PLATFORM_EXPORT_TYPE,
        version: 1,
        platform,
    }

    return JSON.stringify(payload, null, 2)
}

function isWrappedContentPlatformExport(
    parsed: unknown,
): parsed is { type: string; platform: unknown } {
    return (
        typeof parsed === 'object' &&
        parsed !== null &&
        'type' in parsed &&
        'platform' in parsed &&
        typeof parsed.type === 'string'
    )
}

export function parseImportedContentPlatform(raw: string): ContentPlatform {
    const parsed: unknown = JSON.parse(raw)

    if (isWrappedContentPlatformExport(parsed)) {
        if (
            parsed.type === CONTENT_PLATFORM_EXPORT_TYPE ||
            parsed.type === LEGACY_CONTENT_PLATFORM_EXPORT_TYPE
        ) {
            return contentPlatformSchema.parse(parsed.platform)
        }
    }

    return contentPlatformSchema.parse(parsed)
}
