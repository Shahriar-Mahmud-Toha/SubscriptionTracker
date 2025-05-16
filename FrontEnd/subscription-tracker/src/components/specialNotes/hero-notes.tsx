export default function HeroNotes({ noteText, customClasses = "" }: { noteText: string, customClasses?: string }) {
    return (
        <p className={`block text-sm text-muted-foreground ${customClasses}`}>
            <span className="bg-secondary-background px-2 py-1 rounded-md">Note:</span> {noteText}
        </p>
    );
}