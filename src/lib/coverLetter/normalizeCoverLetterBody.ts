const LEADING_SECTION_HEADER_PATTERN =
    /^(?:ключевые навыки|требования|обязанности|условия|о компании|мы предлагаем)\s*$/i

export function normalizeCoverLetterBody(text: string): string {
    const lines = text.replace(/\r\n/g, '\n').split('\n')

    while (lines.length > 0 && LEADING_SECTION_HEADER_PATTERN.test(lines[0].trim())) {
        lines.shift()

        while (lines.length > 0 && lines[0].trim() === '') {
            lines.shift()
        }
    }

    return lines.join('\n').trim()
}
