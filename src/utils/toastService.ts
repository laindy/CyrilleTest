import { toast } from 'react-toastify';

const toastService = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
};

export default toastService;