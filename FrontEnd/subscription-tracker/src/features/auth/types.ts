export type SignupFormData = {
    email: string;
    password: string;
    password_confirmation: string;
};

export type LoginFormData = {
    email: string;
    password: string;
}; 

export type ForgotPasswordFormData = {
    email: string;
};

export type ResetPasswordFormData = {
    password: string;
    password_confirmation: string;
};
