import { getVacancyLetterInputElement } from './vacancyResponsePage'

function setNativeInputValue(
    element: HTMLInputElement | HTMLTextAreaElement,
    value: string,
): void {
    const prototype =
        element instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set

    if (valueSetter) {
        valueSetter.call(element, value)
    } else {
        element.value = value
    }

    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
}

function resolveEditableElement(root: HTMLElement): HTMLElement | null {
    if (
        root instanceof HTMLTextAreaElement ||
        root instanceof HTMLInputElement ||
        root.isContentEditable
    ) {
        return root
    }

    const nestedTextarea = root.querySelector('textarea')
    if (nestedTextarea instanceof HTMLTextAreaElement) {
        return nestedTextarea
    }

    const nestedInput = root.querySelector('input[type="text"], input:not([type])')
    if (nestedInput instanceof HTMLInputElement) {
        return nestedInput
    }

    const contentEditable = root.querySelector<HTMLElement>('[contenteditable="true"]')
    if (contentEditable) {
        return contentEditable
    }

    return null
}

export function fillVacancyLetterInput(value: string): boolean {
    const letterInput = getVacancyLetterInputElement()

    if (!letterInput) {
        return false
    }

    const editableElement = resolveEditableElement(letterInput)

    if (!editableElement) {
        return false
    }

    if (
        editableElement instanceof HTMLTextAreaElement ||
        editableElement instanceof HTMLInputElement
    ) {
        setNativeInputValue(editableElement, value)
        return true
    }

    editableElement.textContent = value
    editableElement.dispatchEvent(new Event('input', { bubbles: true }))
    editableElement.dispatchEvent(new Event('change', { bubbles: true }))

    return true
}
