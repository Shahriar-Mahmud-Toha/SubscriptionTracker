import Link from "next/link";

export default function Forgot() {
    return (
        <div>
            Forgot Page
            <br />
            <Link href="/forgot/reset_password">Reset Password</Link>
        </div>
        
    );
}
