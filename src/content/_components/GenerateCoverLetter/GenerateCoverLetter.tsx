import { ContentWrapper } from '../ContentWrapper'
import useGenerateCoverLetterHook from './GenerateCoverLetter.hooks'
import type { GenerateCoverLetterProps } from './GenerateCoverLetter.types'
import styles from './GenerateCoverLetter.module.css'

function CopyIcon() {
    return (
        <svg
            aria-hidden
            className={styles.copyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    )
}

const GenerateCoverLetter = (_props: GenerateCoverLetterProps) => {
    const {
        handleGenerateCoverLetter,
        handleCopyLetter,
        hasVacancy,
        isGenerating,
        lastGeneratedLetter,
        isCopied,
    } = useGenerateCoverLetterHook()
    const isGenerateDisabled = isGenerating || !hasVacancy
    const isCopyDisabled = isGenerating || !lastGeneratedLetter

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    className={styles.button}
                    disabled={isGenerateDisabled}
                    data-generating={isGenerating ? 'true' : undefined}
                    title={
                        !hasVacancy
                            ? 'Сначала откройте вакансию — текст должен появиться в sidepanel'
                            : undefined
                    }
                >
                    {isGenerating ? 'Генерирую...' : 'Сгенерировать сопровод'}
                </button>

                <div className={styles.copyWrap}>
                    <button
                        type="button"
                        onClick={() => void handleCopyLetter()}
                        className={styles.copyButton}
                        disabled={isCopyDisabled}
                        aria-label={
                            isCopied
                                ? 'Сопроводительное скопировано'
                                : 'Скопировать сопроводительное'
                        }
                        title={
                            lastGeneratedLetter
                                ? isCopied
                                    ? 'Скопировано'
                                    : 'Скопировать сопроводительное'
                                : 'Сначала сгенерируйте сопроводительное'
                        }
                    >
                        <CopyIcon />
                    </button>

                    {lastGeneratedLetter ? (
                        <div className={styles.previewPopover} role="tooltip">
                            <p className={styles.previewTitle}>Текст сопроводительного</p>
                            <p className={styles.previewText}>{lastGeneratedLetter}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </ContentWrapper>
    )
}

export default GenerateCoverLetter
