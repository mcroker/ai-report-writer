import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

export interface EffectiveLearingConfig {
    name: keyof GenerateReportContentOutput,
    label: string,
    bullets: string[],
}

export interface EffectiveLearingValues extends EffectiveLearingConfig {
    comment?: string,
}

export const effectiveLearningConfig: EffectiveLearingConfig[] = [
    {
        label: 'Playing and exploring',
        name: 'playingAndExploring',
        bullets: [
            'Finding out and exploring',
            'Playing with what they know',
            "Being willing to ‘have a go’"
        ]
    },
    {
        label: 'Active learning',
        name: 'activeLearning',
        bullets: [
            'Being involved and concentrating',
            'Keeping trying',
            'Enjoying achieving what they set out to do'
        ]
    },
    {
        label: 'Creating and thinking critically',
        name: 'creatingAndThinkingCritically',

        bullets: [
            'Having their own ideas',
            'Making links',
            'Choosing ways to do things'
        ]
    }
];

export function getEffectiveLearningValues(reportContent?: GenerateReportContentOutput): EffectiveLearingValues[] {
    return effectiveLearningConfig.map(item => ({
        ...item,
        comment: (reportContent !== undefined)
            ? reportContent[item.name as keyof GenerateReportContentOutput]
            : undefined
    }))
}