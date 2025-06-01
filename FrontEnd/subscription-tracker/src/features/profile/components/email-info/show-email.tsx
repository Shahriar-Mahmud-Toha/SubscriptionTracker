import InfoField from "@/components/data-showcase/info-field";

export default function ShowEmail({ email, customClass }: { email: string, customClass?: string }) {

    return (
        <div className={`${customClass}`}>
            <div className="space-y-4">
                <InfoField
                    label="Email"
                    value={email}
                />
            </div>
        </div>
    );
}