import { OpenSidePanel } from '@/components/OpenSidePanel'

export default function App() {
    return (
        <div className="flex min-w-[300px] flex-col gap-4 bg-background p-4 text-foreground">
            <header>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    HH Free Cheat
                </p>
            </header>

            <section className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                    Помогает сохранить резюме, подтянуть вакансию и сгенерировать сопроводительное через вашу LLM.
                    Основной интерфейс — в сайдпанели рядом со страницей.
                </p>
            </section>

            <OpenSidePanel />
        </div>
    )
}
