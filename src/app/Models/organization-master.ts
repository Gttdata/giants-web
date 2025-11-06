
export class OrganizationMaster {
    ID: number;
    NAME: string;
    ADDRESS_LINE_1: string;
    ADDRESS_LINE_2: string;
    LONGITUTE: string;
    LATITUTE: string;
    ADMIN_NAME: string;
    EMAIL_ID: string;
    PASSWORD: number;
    CITY: string;
    TEHSIL: string;
    DISTRICT: string;
    STATE: string;
    COUNTRY: string;
    MOBILE_NUMBER: number;
    PINCODE: number;
    CLIENT_ID: number;
    STATUS: Boolean = true;
    USER_ID = 0;
    ROLE_ID = 0;
    SHORT_CODE: string;

    MAX_LATEMARK_TIME: string;
    MAX_EARLYMARK_TIME: string;
    MAX_APPLIED_LATEMARK_TIME: string;
    MIN_EARLYMARK_APPLIED_TIME: string;
    MAX_LATEMARK_COUNT: string;
    MAX_EARLYMARK_COUNT: string;
    MAX_LATECOMING_COUNT: string;
    HALFDAY_TIME: string;
    DAY_START_TIME: string;
    DAY_END_TIME: string;
}
