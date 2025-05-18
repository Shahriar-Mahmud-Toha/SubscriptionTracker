export default function SubmitButtonRegular({ isSubmitting, disabledText, text, customClasses = "", disabledOnSubmit = false, isSubmitSuccessful = false }: { isSubmitting: boolean, disabledText: string, text: string, customClasses?: string, disabledOnSubmit?: boolean, isSubmitSuccessful?: boolean }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting || disabledOnSubmit}
            className={`cursor-pointer w-full bg-foreground hover:enabled:bg-custom-violet text-background hover:enabled:text-foreground font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-violet focus:ring-offset-2 transition-colors hover:enabled:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${customClasses}`}
        >
            {isSubmitting ? disabledText : text}
        </button>
    );
}
