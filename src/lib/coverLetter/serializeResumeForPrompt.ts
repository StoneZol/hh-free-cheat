import type { Resume } from '@/lib/types/resume/types'

function formatExperience(resume: Resume): string {
    if (resume.experience.length === 0) {
        return 'Нет данных'
    }

    return resume.experience
        .map((item) => {
            const period = [item.startDate, item.endDate].filter(Boolean).join(' — ')
            const description = item.description.trim()

            return [
                `${item.position} в ${item.company}`,
                period ? `Период: ${period}` : '',
                description ? `Описание: ${description}` : '',
            ]
                .filter(Boolean)
                .join('\n')
        })
        .join('\n\n')
}

function formatEducation(resume: Resume): string {
    if (resume.education.length === 0) {
        return 'Нет данных'
    }

    return resume.education
        .map((item) =>
            [item.organization, item.degree, item.speciality].filter(Boolean).join(', '),
        )
        .join('\n')
}

function formatProjects(resume: Resume): string {
    if (resume.projects.length === 0) {
        return 'Нет данных'
    }

    return resume.projects
        .map((item) => {
            const link = item.link ? `\nСсылка: ${item.link}` : ''

            return `${item.name}\n${item.description}${link}`
        })
        .join('\n\n')
}

function formatCertifications(resume: Resume): string {
    if (resume.certifications.length === 0) {
        return 'Нет данных'
    }

    return resume.certifications
        .map((item) => `${item.name}: ${item.description}`)
        .join('\n')
}

export function serializeResumeForPrompt(resume: Resume): string {
    return [
        `Должность: ${resume.title}`,
        `Источник: ${resume.source}`,
        `Язык резюме: ${resume.language}`,
        resume.selfAbout ? `О себе:\n${resume.selfAbout}` : '',
        `Навыки: ${resume.skills.length > 0 ? resume.skills.join(', ') : 'Нет данных'}`,
        `Опыт работы:\n${formatExperience(resume)}`,
        `Образование:\n${formatEducation(resume)}`,
        `Проекты:\n${formatProjects(resume)}`,
        `Сертификаты и курсы:\n${formatCertifications(resume)}`,
    ]
        .filter(Boolean)
        .join('\n\n')
}
