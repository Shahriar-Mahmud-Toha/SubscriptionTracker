import { UseFormRegister, FieldValues, FieldErrors, Path, RegisterOptions } from 'react-hook-form';

interface Option {
    value: string;
    label: string;
}

interface FormInputProps<TFormValues extends FieldValues> {
    id: Path<TFormValues>;
    label: string;
    type: string;
    placeholder?: string;
    defaultValue?: string;
    register: UseFormRegister<TFormValues>;
    errors: FieldErrors<TFormValues>;
    validation?: RegisterOptions<TFormValues>;
    customClass?: string;
    options?: Option[];
    isMandatory?: boolean;
}

export default function FormInput<TFormValues extends FieldValues>({
    id,
    label,
    type,
    placeholder,
    defaultValue,
    register,
    errors,
    validation,
    customClass = '',
    options,
    isMandatory = false,
}: FormInputProps<TFormValues>) {
    return (
        <div className={customClass}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label} {isMandatory ? <span className="text-red-general">*</span> : null}
            </label>
            {type === 'select' ? (
                <select
                    id={id}
                    {...register(id, validation)}
                    className={`w-full px-4 py-2 bg-secondary-background border rounded-lg outline-none focus:ring-2 focus:ring-custom-violet focus:border-transparent ${errors[id] ? 'border-red-500' : 'border-foreground'}`}
                >
                    <option value="">{defaultValue || placeholder}</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    {...register(id, validation)}
                    className={`w-full px-4 py-2  border rounded-lg outline-none focus:ring-2 focus:ring-custom-violet focus:border-transparent ${errors[id] ? 'border-red-500' : 'border-foreground'}`}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                />
            )}
            {errors[id] && (
                <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
            )}
        </div>
    );
} 