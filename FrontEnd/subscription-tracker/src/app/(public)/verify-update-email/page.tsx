import { validateUpdateVerifyEmailParams } from '@/utils/validator';
import { verifyUpdateEmail } from '@/features/profile/actions';


export default async function VerifyUpdateEmailPage({ searchParams }: { searchParams: Promise<{ expires?: string, hash?: string, id?: string, signature?: string, type?: string }> }) {
    const { expires, hash, id, signature, type } = await searchParams;

    if (!expires || !hash || !id || !signature || !type) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-3xl font-bold text-red-general">Invalid Verification Link</h2>
            </div>
        );
    }

    const { isValid, error: validationError } = validateUpdateVerifyEmailParams(expires, hash, id, signature, type);

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
    const result = await verifyUpdateEmail(path, id.toString());

    if (!result.error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-custom-violet">Email Verified and Updated Successfully!</h2>
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