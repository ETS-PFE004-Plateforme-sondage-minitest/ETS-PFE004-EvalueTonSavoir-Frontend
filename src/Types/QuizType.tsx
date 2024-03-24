// QuizType.tsx
export interface QuizType {
    _id: string;
    folderId: string;
    userId: string;
    title: string;
    content: string[];
    created_at: Date;
    updated_at: Date;
}
