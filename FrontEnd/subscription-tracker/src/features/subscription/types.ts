export type SubscriptionType = {
    id?: string;
    name?: string;
    seller_info?: string;
    date_of_purchase?: string;
    reminder_time?: string;
    duration?: number;
    date_of_expiration?: string;
    account_info?: string;
    price?: number;
    currency?: string;
    comment?: string;
    file?: File;
    _isDeleted?: boolean;
}