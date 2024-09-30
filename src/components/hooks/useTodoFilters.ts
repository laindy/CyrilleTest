import { useMemo } from 'react';
import { Todo } from '../../types/todo';

type FilterType = 'all' | 'active' | 'completed';
type SortBy = 'createdAt' | 'title';
type SortOrder = 'asc' | 'desc';

export const useTodoFilters = (
  todos: Todo[],
  filter: FilterType,
  searchQuery: string,
  sortBy: SortBy,
  sortOrder: SortOrder
) => {
  return useMemo(() => {
    return todos
      .filter((todo: Todo) => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter((todo: Todo) => 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: Todo, b: Todo) => {
        if (sortBy === 'title') {
          return sortOrder === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        } else {
          return sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [todos, filter, searchQuery, sortBy, sortOrder]);
};