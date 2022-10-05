export interface DependingField {
  fieldName: string;
  empty: boolean;
  value?: any;
}

export interface Condition {
  type: string;
  stateToSet: boolean;
  dependingFields: DependingField[];
}

export interface Validator {
  type: string;
  errorMessage: string;
  maxLength: number;
  pattern: string;
}

export interface FormField {
  name: string;
  type: string;
  visible: boolean;
  disabled: boolean;
  placeholder?: any;
  label: string;
  value: string;
  helpText?: any;
  required: boolean;
  showLabel: boolean;
  showWithNextField: boolean;
  conditions: any[];
  replicationConf?: any;
  validators: any[];
  elementClasses: any[];
  labelClasses: any[];
  customTags: any[];
  isSelected: boolean;
  isEmptyValue: boolean;
  optionId: number;
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
  conditions: Condition[];
  replicationConf?: any;
  validators: Validator[];
  elementClasses: string[];
  labelClasses: any[];
  customTags: string[];
  size?: number;
  prefix?: any;
  suffix?: any;
  isShowMaxLength?: boolean;
  allowSurroundingWhitespaces?: boolean;
  consumerName: string;
  resourceConfName: string;
  consumerChecksAccess?: boolean;
  dontAskForDetails?: boolean;
  showMinConditions?: boolean;
  acceptAttrValue: string;
  additionalText: string;
  uploadButtonLabel: string;
  editButtonLabel: string;
  showButtonLabel: string;
  deleteButtonLabel: string;
  replaceButtonLabel: string;
  fileLinkLabel?: any;
  minConditionText: string;
  errorMessagesAsJson: string;
  isSelected?: boolean;
  isEmptyValue?: boolean;
  optionId?: number;
  formFields: FormField[];
  emptyValueSelectableElements: any[];
  valueOfSelectedElement?: any;
  labelOfSelectedElement?: any;
  valuesOfSelectedElements: any[];
  labelsOfSelectedElements: any[];
}

export interface Fieldset {
  fields: Field[];
  replicationConf?: any;
  showWithNextSet: boolean;
  name: string;
  visible: boolean;
}

export interface PrjCockpitv3TicketsCombined {
  id: string;
  name: string;
  buttons: any[];
  validators: any[];
  fieldsets: Fieldset[];
}

export interface EF_Tickets_Response {
  'prj-cockpitv3_tickets_combined': PrjCockpitv3TicketsCombined;
}
