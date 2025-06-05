'use client';

import { toast } from "sonner";

export default function ToastGeneralError(message?: string, cusDuration = 3000) {
    return toast.error(message || "Error", { duration: cusDuration });
}