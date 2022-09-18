export interface Logo {
  url: string;
  width: number;
  height: number;
}

export interface EF_Location_Respose {
  id: string;
  ownerId?: any;
  title: string;
  addressLine: string;
  streetName: string;
  streetNumber: string;
  zip: string;
  city: string;
  country: string;
  url: string;
  lat: number;
  lng: number;
  modifyDate: Date;
  creatorId: string;
  numActiveEvents: number;
  numTotalEvents: number;
  canEdit: boolean;
  canDelete: boolean;
  isComplete: boolean;
  activeEvents: string[];
  logo: Logo;
}
