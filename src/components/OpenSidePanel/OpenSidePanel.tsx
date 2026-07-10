import { PanelRightOpen } from 'lucide-react'
import useOpenSidePanelHook from './OpenSidePanel.hooks'
import type { OpenSidePanelProps } from './OpenSidePanel.types'

const OpenSidePanel = ({}: OpenSidePanelProps) => {
    const { openSidePanel } = useOpenSidePanelHook()

    return (
        <button
            type="button"
            onClick={openSidePanel}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
            <PanelRightOpen className="h-4 w-4" />
            Открыть сайдпанель
        </button>
    )
}

export default OpenSidePanel
