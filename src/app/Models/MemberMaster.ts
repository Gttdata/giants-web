export class Membermaster {
    ID: number;
    CLIENT_ID: number;
    NAME: string;
    MOBILE_NUMBER: string;
    GENDER: string;
    DOB: string;
    MARITAL_STATUS: string;
    ADDRESS1: string;
    ADDRESS2: string;
    CITY: string;
    PINCODE: string;
    ANNIVERSARY_DATE: string;
    EMAIL_ID: any;
    BUSSINESS_EMAIL: any;
    FEDERATION_ID: number
    UNIT_ID: number;
    GROUP_ID: number
    MEMBERSHIP_DATE: string;
    EXPIRY_DATE: string;
    IS_FEDERATION_OFFICER: Boolean = false;
    INCHARGE_OF: any;
    STATUS: boolean = true;
    PASSWORD: string;
    ACTIVE_STATUS: string = "A";
    PROFILE_IMAGE: string;
    BIODATA_URL: string;
    SIGNATURE: string;
    COMMUNICATION_MOBILE_NUMBER: any;
    FEDERATION_NAME: string;
    GROUP_NAME: string;
    UNIT_NAME: string;
    IS_NCF: boolean = false;
    SALUTATION: string;
    IS_SHOW_YEAR: boolean = true;
    DROPPED_STATUS: boolean = false;
    DROPPED_DATE: any = null;
    REVIVED_STATUS: boolean = false;
    REVIVED_DATE: any = null;
    IS_HONORABLE: boolean = false;
}