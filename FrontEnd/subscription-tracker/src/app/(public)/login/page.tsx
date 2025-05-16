import Link from "next/link";

export default function Login() {
    return <div>
        <div className="text-2xl font-bold">
            Login Page
        </div>
        <Link href="/forgot">Forgot Password</Link><br />
    </div>;
}
