export class Rform {
    ID:number;
    REPORT_NAME: string;
    DESCRIPTION: string;
    CLIENT_ID:number;
    MODULE_ID:number;
}

export class REPORTSCHEDULE {
    ID: number;
    REPORT_ID: number;
    REPORT_NAME: string;
    DDTIME: any;
    SCHEDULE: string = 'D';
    EMAIL: any;
    HHTIME: any;
    TIMEING: any;
    EVERY_WEEK: any;
    MONTH: any;
    YEAR: any;
    CUSTOM_DATE: any;
    MEMBER_ID: any;
    GROUP_ID: any;
    CLIENT_ID: number = 1;
    STUTAS=0;
    FILTER_QUERY:string;
    SORT_KEY:string;
    SORT_VALUE:string;
    USER_ID:any;
    TYPE_OF_ATTACHEMENT:string;   
}