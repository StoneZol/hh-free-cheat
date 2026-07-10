import { Briefcase } from 'lucide-react'
import { useLastVacancy } from '@/sidepanel/useLastVacancy'

function truncateText(text: string, maxLength = 280): string {
    if (text.length <= maxLength) {
        return text
    }

    return `${text.slice(0, maxLength).trim()}...`
}

export function LastVacancyBlock() {
    const { displayVacancy, isClassifying } = useLastVacancy()

    return (
        <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-primary">
                <Briefcase className="h-4 w-4" />
                <h2 className="text-sm font-semibold">Последняя вакансия</h2>
            </div>

            {!displayVacancy ? (
                <p className="text-sm text-muted-foreground">
                    Откройте страницу вакансии на вкладке. Текст спарсится при открытии страницы или при
                    изменении на ней.
                </p>
            ) : displayVacancy.mode === 'loading' ? (
                <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground break-all">{displayVacancy.url}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                        {isClassifying
                            ? 'Проверяю через LLM, является ли это вакансией...'
                            : 'Парсим вакансию с активной вкладки...'}
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-sm font-semibold text-foreground">{displayVacancy.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground break-all">{displayVacancy.url}</p>

                    {displayVacancy.mode === 'confirmed' ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                            Подтверждено: {new Date(displayVacancy.confirmedAt).toLocaleString()}
                        </p>
                    ) : (
                        <p className="mt-1 text-xs text-muted-foreground">{displayVacancy.statusMessage}</p>
                    )}

                    <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                        {truncateText(displayVacancy.text)}
                    </p>
                </div>
            )}
        </section>
    )
}
