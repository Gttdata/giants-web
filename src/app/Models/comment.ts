
export class Comments {
    MEMBER_ID: number
    POST_ID: any;
    COMMENT: string = ""
    STATUS = 0
    COMMENT_CREATED_DATETIME: any;
    IS_COMMENT_DELETE: boolean = false;
}

export class EventComment {
    MEMBER_ID: number
    EVENT_ID: any;
    COMMENT: string = ""
    STATUS = 0
    CREATED_MODIFIED_DATE: any;
    IS_COMMENT_DELETE: boolean = false;
}

export class Likes {
    MEMBER_ID: number = 0
    POST_ID: number
    CLIENT_ID: number
    STATUS: number
    CREATED_MODIFIED_DATE: any

}

export class EventLikes {
    MEMBER_ID: number = 0
    EVENT_ID: number
    CLIENT_ID: number
    STATUS: number
    CREATED_MODIFIED_DATE: any

}