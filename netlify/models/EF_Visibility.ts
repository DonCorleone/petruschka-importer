export interface Validator {
  type: string;
  errorMessage: string;
  minDate: string;
  maxDate: string;
}

export interface Field {
  name: string;
  type: string;
  visible: boolean;
  disabled: boolean;
  placeholder: string;
  label: string;
  value: string;
  helpText: string;
  required: boolean;
  showLabel: boolean;
  showWithNextField: boolean;
  conditions: any[];
  replicationConf?: any;
  validators: Validator[];
  elementClasses: string[];
  labelClasses: any[];
  customTags: string[];
  isSelected: boolean;
  isEmptyValue: boolean;
  optionId: number;
  size?: number;
  prefix?: any;
  suffix?: any;
  isShowMaxLength?: boolean;
  allowSurroundingWhitespaces?: boolean;
  inputType: string;
  timeLabel?: any;
  timePlaceholder: string;
}

export interface Fieldset {
  fields: Field[];
  replicationConf?: any;
  showWithNextSet: boolean;
  name: string;
  visible: boolean;
}

export interface PrjCockpitv3EventVisibility {
  id: string;
  name: string;
  buttons: any[];
  validators: any[];
  fieldsets: Fieldset[];
}

export interface EF_Visibility_Response {
  'prj-cockpitv3_event_visibility': PrjCockpitv3EventVisibility;
}
