import PageTitle from "@/components/titles/page-title";
import LoginForm from "@/features/auth/components/login-form";  
import LinkRegular from "@/components/buttons/link-regular";

export default function Login() {
    return <div className="flex flex-col items-center">
        <PageTitle title="Login" />
        <LoginForm customClass="mt-5 mb-5" />
        <LinkRegular href="/forgot" text="Forgot Password?" customClasses="block mt-2" />
        <LinkRegular href="/signup" text="Signup" customClasses="block mt-2" />
    </div>;
}
