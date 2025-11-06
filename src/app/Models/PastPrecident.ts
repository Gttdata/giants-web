export class PastPrecident {
    ID: number
    GROUP_ID: number
    MEMBER_ID: number
    REGULAR_MEETNG_COUNT_TOTAL: number
    REGULAR_MEETNG_COUNT_OUT_OF: number
    BOARD_MEETNG_COUNT_TOTAL: number
    BOARD_MEETNG_COUNT_OUT_OF: number
    PROJECTS_COUNT_TOTAL: number
    PROJECTS_COUNT_OUT_OF: number
    MEMBERSHIP_EXTENSION_CONTRIBUTE_COUNT: number
    MEMBERSHIP_RETENTION_CONTRIBUTE_COUNT: number
    AS_A_ASSET_DETAILS: string = ''
    AS_A_MOTIVATION_DETAILS: string = ''
    DISCHARGED_FISCAL_OBLIGATION_DETAILS: string = ''
    FUND_RAISING_PROGRAM_DETAILS: string = ''
    FUND_RAISING_PROGRAM_PARTICIPATE_DETAILS: string = ''
    UNIT_COUNCILS_TOTAL: number;
    UNIT_COUNCILS_OUT_OF: number;
    UNIT_CONFERENCE_TOTAL: number;
    UNIT_CONFERENCE_OUT_OF: number;
    FED_CONVENTION_TOTAL: number;
    FED_CONVENTION_OUT_OF: number;
    GI_CONVENTION_TOTAL: number;
    GI_CONVENTION_OUT_OF: number;
    BRANCH_CONTRIBUTION_DETAILS: string = '';
    OTHER_DETAILS: string = '';
    CREATED_DATE: any;
    INITIATED_PROJECT_DETAILS = [];
    AWARD_TYPE: any;
    NAME_OF_THE_MEMBER:string;
    NAME_OF_THE_GROUP:string;
    SWITCH:boolean=true;
    GROUP_NAME:string;
    MEMBER_NAME:string;

    IS_SUBMITED:string = 'D'
}

export class PastPrecidentTitleDrawer {
    ID: number = 0;
    OUTSTANDING_PRESIDENT_ID: number = 0
    PROJECT_TITLE: string
    IMPLEMENTATION_DATE: any
    RESULT: string;
    EFFECT_ON_SOCIETY: string;
}