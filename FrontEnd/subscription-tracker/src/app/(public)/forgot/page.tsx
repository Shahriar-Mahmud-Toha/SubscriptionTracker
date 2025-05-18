import LinkRegular from "@/components/buttons/link-regular";
import PageTitle from "@/components/titles/page-title";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export default function Forgot() {
    return (
        <div className="flex flex-col items-center">
            <PageTitle title="Forgot Password" />
            <ForgotPasswordForm customClass="mt-5 mb-5" />
            <LinkRegular href="/signup" text="Signup" customClasses="block mt-2" />
            <LinkRegular href="/login" text="Login" customClasses="block mt-2" />
        </div>
    );
}
