import Link from "next/link";

export default function Signup() {
    return <div>
        <div className="text-2xl font-bold">
            Signup Page
        </div>
        <Link href="/forgot">Forgot Password</Link><br />
    </div>;
}

