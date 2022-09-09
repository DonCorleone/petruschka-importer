export interface EmblemToShow {
  url: string;
  width: number;
  height: number;
}

export interface EF_Event_Detail {
  id: string;
  groupId: string;
  title?: string;
  begin: Date;
  end: Date;
  eventDateString: string;
  cancelled: boolean;
  cancelledDescription?: any;
  isCoronaDonation: boolean;
  coronaSeatBlocking: boolean;
  isHelpGastro: boolean;
  visible: boolean;
  published: boolean;
  agendaEntryOnly: boolean;
  locationIds: string[];
  creationDate: Date;
  modifyDate: Date;
  currencyId: number;
  currencySymbol: string;
  legalCountry: string;
  organizerId: string;
  accountAddressId: string;
  organizerName: string;
  hasSeatmap: boolean;
  creatorId: string;
  hasFullBrandingCampaign: boolean;
  hasSoldOrBlockedTickets: boolean;
  isStreamingEvent: boolean;
  model: string;
  modelPlusPrice: string;
  modelProPrice: string;
  campaignPriceString: string;
  payBackGuaranteeEnabled: boolean;
  payBackGuaranteeMode: string;
  bankAccountSaleEndDate?: any;
  bankAccountPaymentPeriodInDays?: any;
  phoneVerificationEnabled: boolean;
  freeEventMaxTicketPrice: number;
  maxTicketPrice: number;
  cashlessPaymentActive: boolean;
  isFreeEvent: boolean;
  saleState: string;
  checklistProgress: number;
  state: string;
  emblemToShow: EmblemToShow;
  ticketTax: number;
  countryOfOrigin: string;
  partner: string;
  url: string;
  shortDesc?: string;
  description?: string;
  artists?: string;
  facebookPixelId?: string;
}

export interface EF_Event_Detail_Response {
  additionalFields?: any;
  totalNumberOfResources: number;
  events: EF_Event_Detail[];
}
