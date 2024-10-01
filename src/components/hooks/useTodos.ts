import { useState, useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import httpService from '../../service/httpService';
import { Todo } from '../../types/todo';
import { useTranslation } from 'react-i18next';
import toastService from '../../utils/toastService';

export const useTodos = () => {
  const { t } = useTranslation(); 
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedTodos = await httpService.getTodos();
      
      const sanitizedTodos = loadedTodos.map(todo => ({
        ...todo,
        title: todo.title ? todo.title : 'Untitled'
      }));
      
      setTodos(sanitizedTodos);
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
        setTodos(prevTodos => [...prevTodos, { ...addedTodo, title: addedTodo.title ? addedTodo.title : 'Untitled' }]);
        toastService.success(t('todo.success')); 
        Toast.show({
          type: 'success',
          text1: 'Salut 👋',
          text2: 'Tâche ajoutée avec succès ! 👌'
        }); 
        return addedTodo;
      } catch (err) {
        setError('Error adding todo');
        console.error('Error adding todo:', err);
        Toast.show({
          type: 'success',
          text2: 'Erreur lors de l\'ajout du todo.'
        });      
       }
    }
  }, []);

  const toggleTodo = useCallback(async (id: number) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (todoToUpdate) {
        const updatedTodo = await httpService.updateTodo(id, !todoToUpdate.completed);
        
        setTodos(prevTodos => prevTodos.map(todo => 
          todo.id === id ? { ...updatedTodo, title: updatedTodo.title ? updatedTodo.title : 'Untitled' } : todo
        ));
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

  const sortTodos = useCallback((order: 'asc' | 'desc') => {
    setTodos(prevTodos => 
      [...prevTodos].sort((a, b) => {
        const titleA = a.title ? a.title.toLowerCase() : '';
        const titleB = b.title ? b.title.toLowerCase() : '';
        return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      })
    );
  }, [setTodos]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return { todos, isLoading, error, addTodo, toggleTodo, deleteTodo, loadTodos, sortTodos };
};
