export default function PageTitle({ title, customClass }: { title: string, customClass?: string }) {
    return (

        <h1 className={`text-3xl font-bold text-foreground ${customClass}`}>{title}</h1>
    );
}
