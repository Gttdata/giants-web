export class TickRole {
    ID: number;
    PARENT_ROLE_ID: string;
    PARENT_ID = 0;
    CLIENT_ID: number;
    NAME: string;
    SHORT_CODE: string;
    STATUS: boolean = true;
    SEQUENCE_NO: number;
    PARENT_NAME = '';
    TYPE = 'U';
    DESCRIPTION = '';
    START_PAGE = '/dashboard';
    REPORTING_MANAGERS: [];
}