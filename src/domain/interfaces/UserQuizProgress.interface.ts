

export interface UserQuizProgressInterface {
    user_id: string;
    quiz_id: string;
    quiz_level_id: string;
    completed: boolean;
    score: number;
    skipped_questions: number[];
    answered_questions: number[];
    finished_at: Date;
}