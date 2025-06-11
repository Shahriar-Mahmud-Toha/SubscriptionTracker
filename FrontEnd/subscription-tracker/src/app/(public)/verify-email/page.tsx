import { validateSignupVerifyEmailParams } from '@/utils/validator';
import { verifySignupEmail } from '@/features/auth/actions';


export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ expires?: string, hash?: string, id?: string, signature?: string }> }) {
    const { expires, hash, id, signature } = await searchParams;

    if (!expires || !hash || !id || !signature) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-3xl font-bold text-red-general">Invalid Verification Link</h2>
            </div>
        );
    }

    const { isValid, error: validationError } = validateSignupVerifyEmailParams(expires, hash, id, signature);

    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-general">Invalid Verification Link</h2>
                    <p className="mt-2 text-regular-muted">{validationError}</p>
                </div>
            </div>
        );
    }
    const path = `/verify-email?expires=${expires}&hash=${hash}&id=${id}&signature=${signature}`;
    const result = await verifySignupEmail(path, id);

    if (!result.error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-custom-violet">Email Verified and Signup Completed Successfully!</h2>
                    <p className="mt-2">You can now log in to your account.</p>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-general">Verification Failed</h2>
                    <p className="mt-2 text-regular-muted">{result.error}</p>
                </div>
            </div>
        );
    }
}