import { useState, type MouseEvent } from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

type ConfirmImportButtonProps = {
    disabled?: boolean
    onConfirm: (raw: string) => void | Promise<void>
    onError?: (message: string) => void
    confirmLabel?: string
}

export function ConfirmImportButton({
    disabled = false,
    onConfirm,
    onError,
    confirmLabel = 'Перезаписать настройки?',
}: ConfirmImportButtonProps) {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation()
        setIsSubmitting(true)

        try {
            const raw = await navigator.clipboard.readText()

            if (!raw.trim()) {
                onError?.('Буфер обмена пуст.')
                return
            }

            await onConfirm(raw)
            setIsConfirmationOpen(false)
        } catch (error: unknown) {
            onError?.(
                error instanceof Error
                    ? error.message
                    : 'Не удалось прочитать буфер обмена. Разрешите доступ к clipboard.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isConfirmationOpen) {
        return (
            <div
                className="flex shrink-0 items-center gap-2"
                onClick={(event) => event.stopPropagation()}
            >
                <span className="text-xs text-muted-foreground">{confirmLabel}</span>
                <button
                    type="button"
                    disabled={disabled || isSubmitting}
                    onClick={(event) => void handleConfirm(event)}
                    className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? '...' : 'Да'}
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsConfirmationOpen(false)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Нет
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            title="Вставить конфиг из буфера обмена"
            aria-label="Вставить конфиг из буфера обмена"
            disabled={disabled}
            onClick={(event) => {
                event.stopPropagation()
                setIsConfirmationOpen(true)
            }}
            className={cn(
                'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60',
            )}
        >
            <Download className="h-4 w-4" />
        </button>
    )
}
