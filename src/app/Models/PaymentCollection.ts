export class PaymentCollection {
    ID: number;
    MEMBER_ID: number = 0;
    CLIENT_ID: number = 1;
    DATE: string;
    PAYMENT_TYPE: any = [];
    PAYMENT_MODE: string;
    PAYMENT_REFERENCE_NO: string;
    NARRATION: string;
    AMOUNT: number;
    STATUS: boolean = true;
    FILE_URL: string = '';
    PAYMENT_DETAILS: any = [];
    GROUP_ID: number;
    PAYMENT_TRANSACTION_MODE: string;
    RECEIVED_STATUS: string;
    CHILD_GROUP_ID: number;
    CHILD_GROUP_AMOUNT: number = 0;
}