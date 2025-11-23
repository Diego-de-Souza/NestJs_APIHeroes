export interface QuizInterface {
    id: number;
    name: string;
    logo: string | null;
    theme: string;
}

export interface QuizWithLevelsInterface extends QuizInterface {
    quiz_levels: QuizLevelInterface[];
}

export interface QuizLevelInterface {
    id: number;
    quiz_id: number;
    name: string;
    difficulty: string;
    unlocked: boolean;
    questions: number;
    xp_reward: number;
}