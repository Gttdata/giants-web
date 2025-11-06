import { PriceListDetails } from "./PriceListDetails";

export class PriceList {
    ID: number;
    CLIENT_ID: number;
    NAME: string;
    WEF_DATE: string;
    MODEL_ID: number;
    STATUS: boolean = true;
    PRICE_LIST_DETAILS: PriceListDetails[];
}