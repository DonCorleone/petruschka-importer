  export interface PriceStrategy {
    type?: number;
    lowestPrice?: number;
    highestPrice: number;
    minPriceDate?: any;
    maxPriceDate?: any;
  }

  export interface Category {
    eventId?: string;
    id?: number;
    parentCategoryId?: number;
    title: string;
    priceStrategy: PriceStrategy;
    quantity?: number;
    attachedEventIds?: any[];
    sortorder?: number;
    color?: string;
    minTicketPurchase?: number;
    maxTicketPurchase?: number;
    visibility?: number;
    visibleFromDate?: any;
    visibleToDate?: any;
  }

  export interface EF_Categories_Response {
    additionalFields?: any;
    totalNumberOfResources: number;
    attachedCategories: any[];
    categories: Category[];
  }



