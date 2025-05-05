export interface MailAccount {
    id: number;
    mail_id: string;
    status: 'active' | 'inactive';
    app_code: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export type CreateMailAccountData = Pick<MailAccount, 'mail_id' | 'status' | 'app_code' | 'description'>;
export type UpdateMailAccountData = CreateMailAccountData;
