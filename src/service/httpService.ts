import axios from 'axios';
import { Todo } from '../types/todo';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const httpService = {
    getTodos: async (): Promise<Todo[]> => {
        const response = await axios.get<Todo[]>(API_URL);
        return response.data;
    },

    addTodo: async (title: string): Promise<Todo> => {
        const response = await axios.post<Todo>(API_URL, { title, completed: false });
        return response.data;
    },

    updateTodo: async (id: number, completed: boolean): Promise<Todo> => {
        const response = await axios.put<Todo>(`${API_URL}/${id}`, { completed });
        return response.data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};

export default httpService;