export class TrainingSchedule {
    ID: number;
    PROGRAM_TITLE: string;
    DESCRIPTION: string;
    SUBJECT_ID: number;
    DATE: any = new Date();
    START_TIME: any;
    END_TIME: any;
    ASSESSMENT_TYPE: string = 'O';
    OBSERVATIONS: string = '';
    ASSESSOR_ID: number;
    VENUE: string;
    STATUS: string = 'P';
    TRAINER_ID: number;
    TRAINING_TYPE_ID: string = '1';
    TRAINER_REMARK: string = '';
    IS_SATISFIED: any = '1';
}    