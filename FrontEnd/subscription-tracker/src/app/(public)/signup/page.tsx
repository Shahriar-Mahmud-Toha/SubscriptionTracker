import PageTitle from '@/components/titles/page-title';
import SignupForm from '@/features/auth/components/signup-form';
import LinkRegular from "@/components/buttons/link-regular";

export default function Signup() {
    return <div className="flex flex-col items-center">
        <PageTitle title="Signup" />
        <SignupForm customClass="mt-5 mb-5" />
        <LinkRegular href="/forgot" text="Forgot Password?" customClasses="block mt-2" />
        <LinkRegular href="/login" text="Login" customClasses="block mt-2" />
    </div>;
}

