import {EF_Event_Detail} from "./EF_Event_Detail";

export interface ImageToShow {
  url: string;
  width: number;
  height: number;
}

export interface EF_Event_Group {
  id: string;
  title: string;
  descriptionToShow: string;
  url: string;
  creatorId: string;
  eventIds: string[];
  modifyDate?: any;
  imageToShow: ImageToShow;
  isVisible: boolean;
}
