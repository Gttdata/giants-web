export class OutstandingMonumental{
    ID:number;
    CLIENT_ID:number;
    GROUP_ID:number;
    // DATE_OF_BIDING:any;
    GROUP_NAME:string;
    MONUMENT_PROJECT_NAME:string;
    DATE_OF_LAUNCHING:any;
    DATE_OF_COMPLETION:any;
    TOTAL_EXPENCES_IN_PROJECT:number;
    TOTAL_BUDGET_IN_PROJECT:number;
    BENEFITS_OF_PROJECT:string;
    BENEFITS_TO_PUBLIC:string;
    AIMS_AND_OBJECTS:String;
    NATIONAL_PROGRAMME :string='';
    LOCAL_BODIES_APPROVED :string='';
    OTHER_DETAILS :string='';
    MONUMENTAL_PROJECT_SPONSORSHIP:any[];
    MONUMENTAL_BANNER_PHOTOS:any[];
    MONUMENTAL_PRESS_CLIPPING:any[];

    IS_SUBMITED:string = 'D'
}
