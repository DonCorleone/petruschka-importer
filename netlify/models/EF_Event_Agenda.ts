import {EF_Event_Ui} from "./EF_Event_UI";

export interface Validator {
  type: string;
  errorMessage: string;
  maxLength: number;
  pattern: string;
}

export interface Field {
  name: string;
  type: string;
  visible: boolean;
  disabled: boolean;
  placeholder: string;
  label: string;
  value: string;
  helpText?: any;
  required: boolean;
  showLabel: boolean;
  showWithNextField: boolean;
  conditions: any[];
  replicationConf?: any;
  validators: Validator[];
  elementClasses: string[];
  labelClasses: any[];
  customTags: any[];
  size?: number;
  prefix?: any;
  suffix?: any;
  isShowMaxLength?: boolean;
  allowSurroundingWhitespaces?: boolean;
}

export interface EF_Event_Agenda_Response {
  'prj-cockpitv3_event_agendainfo': EF_Event_Ui;
}
