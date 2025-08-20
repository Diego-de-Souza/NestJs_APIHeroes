

export interface UserQuizProgressInterface {
    user_id: number;
    quiz_id: number;
    quiz_level_id: number;
    completed: boolean;
    score: number;
    skipped_questions: number[];
    answered_questions: number[];
    finished_at: Date;
}