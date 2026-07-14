import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

type ConfirmDeleteButtonProps = {
    label?: string
    iconOnly?: boolean
    disabled?: boolean
    onConfirm: () => void
    confirmLabel?: string
}

export const ConfirmDeleteButton = ({
    label = 'Удалить',
    iconOnly = false,
    disabled = false,
    onConfirm,
    confirmLabel = 'Вы уверены?',
}: ConfirmDeleteButtonProps) => {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

    if (isConfirmationOpen) {
        return (
            <div
                className="flex shrink-0 items-center gap-2"
                onClick={(event) => event.stopPropagation()}
            >
                <span className="text-xs text-muted-foreground">{confirmLabel}</span>
                <button
                    type="button"
                    onClick={() => {
                        onConfirm()
                        setIsConfirmationOpen(false)
                    }}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/15"
                >
                    Да
                </button>
                <button
                    type="button"
                    onClick={() => setIsConfirmationOpen(false)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                >
                    Нет
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            title={iconOnly ? label : undefined}
            aria-label={iconOnly ? label : undefined}
            disabled={disabled}
            onClick={(event) => {
                event.stopPropagation()
                setIsConfirmationOpen(true)
            }}
            className={cn(
                'shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60',
                iconOnly
                    ? 'inline-flex h-8 w-8 items-center justify-center'
                    : 'px-3 py-1.5 text-xs font-medium',
            )}
        >
            {iconOnly ? <Trash2 className="h-4 w-4" /> : label}
        </button>
    )
}
