'use client';
import { toast } from "sonner";

export default function ToastGeneralSuccess(message?: string, cusDuration = 3000) {
    return toast.success(message || "Success", { duration: cusDuration });
}