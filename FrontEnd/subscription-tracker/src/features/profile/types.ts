export type GeneralInfoType = {
    first_name: string;
    last_name: string;
    dob: string;
};
export type UserProfileInfoType = {
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
};
export type EmailType = {
    email: string;
}
export type PasswordUpdateType = {
    current_password: string;
    password: string;
    password_confirmation: string;
};