export interface EF_Event_Overview {
  id: string;
  modifyDate?: Date;
}

export interface EF_Event_Overview_Response {
  events: EF_Event_Overview[];
}
