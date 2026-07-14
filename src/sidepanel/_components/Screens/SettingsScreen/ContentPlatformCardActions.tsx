import { Upload } from 'lucide-react'
import { ConfirmDeleteButton } from './ConfirmDeleteButton'
import { ConfirmImportButton } from './ConfirmImportButton'

type ContentPlatformCardActionsProps = {
    onExport: () => void
    onImport: (raw: string) => void | Promise<void>
    onImportError?: (message: string) => void
    onDelete: () => void
    disabled?: boolean
}

const actionButtonClassName =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60'

export function ContentPlatformCardActions({
    onExport,
    onImport,
    onImportError,
    onDelete,
    disabled = false,
}: ContentPlatformCardActionsProps) {
    return (
        <div
            className="flex shrink-0 items-center gap-1"
            onClick={(event) => event.stopPropagation()}
        >
            <button
                type="button"
                title="Скопировать конфиг в буфер обмена"
                aria-label="Скопировать конфиг в буфер обмена"
                disabled={disabled}
                onClick={onExport}
                className={actionButtonClassName}
            >
                <Upload className="h-4 w-4" />
            </button>

            <ConfirmImportButton
                disabled={disabled}
                onConfirm={onImport}
                onError={onImportError}
            />

            <ConfirmDeleteButton iconOnly disabled={disabled} onConfirm={onDelete} />
        </div>
    )
}
