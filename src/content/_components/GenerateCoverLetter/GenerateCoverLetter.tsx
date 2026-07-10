import { ContentWrapper } from '../ContentWrapper'
import useGenerateCoverLetterHook from './GenerateCoverLetter.hooks'
import type { GenerateCoverLetterProps } from './GenerateCoverLetter.types'
import styles from './GenerateCoverLetter.module.css'

const GenerateCoverLetter = (_props: GenerateCoverLetterProps) => {
    const { handleGenerateCoverLetter, isGenerating } = useGenerateCoverLetterHook()

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    className={styles.button}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Генерирую...' : 'Сгенерировать сопровод'}
                </button>
            </div>
        </ContentWrapper>
    )
}

export default GenerateCoverLetter
