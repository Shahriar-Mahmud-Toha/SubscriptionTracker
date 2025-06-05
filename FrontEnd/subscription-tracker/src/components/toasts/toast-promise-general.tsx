'use client';
import { toast } from "sonner";

interface ToastPromiseGeneral<T> {
    promise: Promise<T>;
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    duration?: number;
}

export default function ToastPromiseGeneral<T>({
    promise,
    loadingMessage = 'Loading...',
    successMessage = 'Operation Successful',
    errorMessage = 'Operation Failed',
    duration = 3000,
}: ToastPromiseGeneral<T>) {
    return toast.promise(promise, {
        loading: loadingMessage,
        success: (result: any) => {
            if (result?.error) {
                throw new Error(result.error);
            }
            return {
                message: successMessage,
            };
        },
        error: (error: Error) => ({
            message: error.message || errorMessage,
            style: {
                borderColor: 'var(--red-general)',
                color: 'var(--red-general)',
            },
        }),
        duration
    });
}