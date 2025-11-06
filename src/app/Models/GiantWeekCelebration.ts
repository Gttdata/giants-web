export class GiantWeekCelebration {
    ID: number;
    MEMBER_ID: number;
    GROUP_ID: number;
    CREATED_DATETIME: any;
    PUBLIC_IMPACT: string = '';
    MOTIVATED_MEMBERS: string = '';
    IMAGE_IN_PUBLIC: string = '';
    SCHEDULE_OF_WORK = [];
    PROJECT_DURING_SERVICE_WEEK = [];
    PROJECT_EXPENSES_DETAILS_SPONSORSHIP = [];
    DESCRIPTION_OF_WEEK = [];
    PUBLICITY_WITH_PRESS = [];
    SWITCH_WEEKCELE: any;

    GROUP_NAME:string;
    CREATED_DATE:string;

    IS_SUBMITED:string = 'D'
}
export class DateAndScheduleModel {
    ID: number;
    OUTSTANDING_GIANTS_WEEK_ID: number
    DATE: any
    SCHEDULE: string;
}
export class ProjectDuringServiceModel {
    ID: number;
    OUTSTANDING_GIANTS_WEEK_ID: number;
    PROJECT_TITLE: string;
    PHOTO_URL_1: string;
    PHOTO_URL_2: string;
    PHOTO_URL_3: string;
}
export class ProjectExpensesModel {
    ID: number;
    OUTSTANDING_GIANTS_WEEK_ID: number
    PROJECT: string;
    SPONSORSHIP_DATE: any;
    AMOUNT: number;
    EXPENSES_DETAILS: string;
}
export class DescriptionOfWeekModel {
    ID: number;
    OUTSTANDING_GIANTS_WEEK_ID: number;
    DATE: any;
    DESCRIPTION: string;
}
export class PublicityWithPressModel {
    ID: number;
    OUTSTANDING_GIANTS_WEEK_ID: number
    TITLE: string;
    NEWS_PAPER_NAME: string;
    PHOTO_URL: string;
}