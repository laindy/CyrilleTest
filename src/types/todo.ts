export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortByType = 'createdAt' | 'title';
export type SortOrderType = 'asc' | 'desc';