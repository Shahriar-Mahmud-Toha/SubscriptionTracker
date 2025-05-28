export default function SectionTitle({ title, customClass }: { title: string, customClass?: string }) {
    return (
        <h2 className={`text-2xl font-bold ${customClass}`}>{title}</h2>
    );
}