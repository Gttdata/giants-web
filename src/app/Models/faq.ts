export class Faq {
    ID: number;
    CLIENT_ID: number;
    FAQ_HEAD_ID: number;
    QUESTION: string;
    ANSWER: string;
    SEQ_NO: number;
    POSITIVE_HELPFUL_COUNT: number;
    NEGATIVE_HELPFUL_COUNT: number;
    URL: string;
    TAGS: string;
    IS_STATUS: boolean;
    STATUS: boolean = true;
    NIGATIVE_FLAG: boolean
    TAGS_STRING: string[] = [];

}
