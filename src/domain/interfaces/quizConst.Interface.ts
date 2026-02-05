export interface QuizInterface {
    id: string;
    name: string;
    logo: string | null;
    theme: string;
}

export interface QuizWithLevelsInterface extends QuizInterface {
    quiz_levels: QuizLevelInterface[];
}

export interface QuizLevelInterface {
    id: string;
    quiz_id: string;
    name: string;
    difficulty: string;
    unlocked: boolean;
    questions: number;
    xp_reward: number;
}

