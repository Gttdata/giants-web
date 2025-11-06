export class MemberAwardModel {
    ID: number;
    GROUP_ID:number;
    MEMBER_ID:number;
    CREATED_DATE: any;
    PARTICIPATION_IN_MEETINGS: number
    PARTICIPATION_IN_MEETINGS_OUT_OF: number
    PARTICIPATION_IN_PROJECTS: number
    PARTICIPATION_IN_PROJECTS_OUT_OF: number
    PARTICIPATION_IN_UNIT_CONFERENCE: number
    PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF: number
    PARTICIPATION_IN_GWF_PAST_CONVENTION: string;
    NATIONAL_EXTENSION: string;
    INTERNATIONAL_EXTENSION: string;
    GROUP_ACTIVITIES: string;
    FISCAL_ACTIVITIES: string;
    OTHER_DETAILS: string;
    AWARD_TYPE:string;
    NEW_MEMBER_ADDED= [];
    DETAILS_AND_DOCUMENT= [];

    GROUP_NAME:string;
    MEMBER_NAME:string;
    CREATED_MODIFIED_DATE:any;

    IS_SUBMITED:string = 'D'
}
export class NewMemberModel {
    ID: number;
    OUTSTANDING_MEMBER_ID:number;
    MEMBER_NAME:string;
    YEAR:any;
}
export class DetailAndDocumentModel {
    ID: number;
    OUTSTANDING_MEMBER_ID: number
    DETAILS: string;
    DOCUMENTS: any;
}