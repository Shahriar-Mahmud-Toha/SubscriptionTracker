export default function PageTitle({ title }: { title: string }) {
    return (

        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
    );
}
