export class TrainingSubMaster {
    ID: number = 0;
    TITLE: string = '';
    SHORT_CODE: string = '';
    DESCRIPTION: string = '';
    IS_ACTIVE: Boolean = true;
    SEQ_NO: Number = 0;
}


export class TrainigPointMap {

    ID: number = 0;

    SUBJECT_MASTER_ID: number = 0;
    POINTS_ID: number = 0;
    SEQ_NO: number = 0;
    PERIOD: number = 0;
    IS_ACTIVE: boolean = true;
}

