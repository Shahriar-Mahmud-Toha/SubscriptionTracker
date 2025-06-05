export type SubscriptionType = {
    id?: string;
    name?: string;
    seller_info?: string;
    date_of_purchase?: Date;
    reminder_time?: Date;
    duration?: number;
    date_of_expiration?: Date;
    account_info?: string;
    price?: number;
    currency?: string;
    comment?: string;
    file?: File;
    _isDeleted?: boolean;
}