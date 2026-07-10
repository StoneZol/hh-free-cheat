export type InternalVacancyClassificationConfig = {
    systemPrompt: string
}

export const INTERNAL_VACANCY_CLASSIFICATION_CONFIG: InternalVacancyClassificationConfig = {
    systemPrompt: `Ты классификатор текста.
Получаешь фрагмент, спарсенный со страницы.
Определи, является ли этот текст описанием вакансии для найма сотрудника.

Верни только JSON:
{ "isVacancy": true }
или
{ "isVacancy": false }

Правила:
- true: есть признаки вакансии — должность, обязанности, требования, компания, условия работы.
- false: это не вакансия — резюме, новость, список вакансий, форма отклика, ошибка, пустой или нерелевантный текст.
- Не добавляй пояснений, только JSON.`,
}
