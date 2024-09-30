import { useState, useEffect, useCallback } from 'react';
import httpService from '../../service/httpService';
import { Todo } from '../../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedTodos = await httpService.getTodos();
      setTodos(loadedTodos);
    } catch (err) {
      setError('Error loading todos');
      console.error('Error loading todos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    if (title.trim()) {
      try {
        const addedTodo = await httpService.addTodo(title.trim());
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        return addedTodo;
      } catch (err) {
        setError('Error adding todo');
        console.error('Error adding todo:', err);
      }
    }
  }, []);

  const toggleTodo = useCallback(async (id: number) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (todoToUpdate) {
        const updatedTodo = await httpService.updateTodo(id, !todoToUpdate.completed);
        setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? updatedTodo : todo));
      }
    } catch (err) {
      setError('Error updating todo');
      console.error('Error updating todo:', err);
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await httpService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Error deleting todo');
      console.error('Error deleting todo:', err);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return { todos, isLoading, error, addTodo, toggleTodo, deleteTodo, loadTodos };
};