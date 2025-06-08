import PageTitle from "@/components/titles/page-title";
import { validateResetPasswordToken } from "@/utils/validator";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export default async function ResetPassword({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const { isValid, error } = validateResetPasswordToken(token);

    if (!isValid) {
        return (
            <div className="flex flex-col items-center">
                <PageTitle title="Invalid Reset Link" />
                <p className="text-red-general mt-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <PageTitle title="Reset Password" />
            <ResetPasswordForm
                token={token}
                customClass="mt-5 mb-5"
            />
        </div>
    );
}
