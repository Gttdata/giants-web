export class GroupProjectMaster {
    ID: number;
    CLIENT_ID: number;
    GROUP_ID: number;
    PROJECT_TYPE_ID: number;
    PROJECT_NAME: string;
    DESCRIPTION: string;
    CURRENT_STATUS: string = "P";
    DATE_OF_PROJECT: any;
    TOTAL_EXPENSES: number;
    BENIFICIERY_DETAILS: string;
    AWARDS_RECEIVED: any;
    PHOTO1: string;
    PHOTO2: string;
    PHOTO3: string;
    CREATOR_ID: number;
    STATUS: string = "D";
    IS_DELETED: boolean = false;
    FEDERATION_ID_TO_SHOW: Number = 0;
    UNIT_ID_TO_SHOW: Number = 0;
    GROUP_ID_TO_SHOW: Number = 0;
}