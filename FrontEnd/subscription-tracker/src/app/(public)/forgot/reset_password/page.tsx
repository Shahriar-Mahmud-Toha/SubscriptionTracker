import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import PageTitle from "@/components/titles/page-title";

export default async function ResetPassword() {
    try {
        const headersList = await headers();

        const token = headersList.get('x-reset-token');
        const email = headersList.get('x-reset-email');

        // If somehow headers are missing (shouldn't happen due to middleware), redirect
        if (!token || !email) {
            redirect('/forgot');
        }

        return (
            <div className="flex flex-col items-center">
                <PageTitle title="Reset Password" />
                <ResetPasswordForm
                    token={token}
                    email={email}
                    customClass="mt-5 mb-5"
                />
            </div>
        );
    } catch (error) {
        redirect('/forgot');
    }
}
