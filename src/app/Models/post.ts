export class Post {
    ID: number;
    CLIENT_ID: number = 1;
    MEMBER_ID = 0;
    DESCRIPTION = '';
    POST_CREATED_DATETIME: any;
    IMAGE_URL1 = '';
    IMAGE_URL2 = '';
    IMAGE_URL3 = '';
    STATUS = 0;
    LIKE_COUNT = 0;
    COMMENT_COUNT = 0;
    HASHTAGS: any;
    TYPE_ID: any;
    POST_TYPE: string = "P";
    POST_CREATED_MEMBER_ID: number = 0;
    POST_STATUS: string = "D";
    IS_DELETED: boolean = false;
    IS_EVENT_POST: boolean = false;
}
