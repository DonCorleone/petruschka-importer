export interface DependingField {
  fieldName: string;
  empty: boolean;
  value: string;
}

export interface Condition {
  type: string;
  stateToSet: boolean;
  dependingFields: DependingField[];
}

export interface Validator {
  type: string;
  errorMessage: string;
  maxLength?: number;
  pattern: string;
  emptyValueString: string;
  minDate: string;
  maxDate: string;
}

export interface Validator2 {
  type: string;
  errorMessage: string;
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
  validators: Validator2[];
  elementClasses: string[];
  labelClasses: any[];
  customTags: any[];
  isSelected: boolean;
  isEmptyValue: boolean;
  optionId: number;
}

export interface Validator3 {
  type: string;
  errorMessage: string;
}

export interface EmptyValueSelectableElement {
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
  validators: Validator3[];
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
  customTags: any[];
  size: number;
  prefix?: any;
  suffix?: any;
  isShowMaxLength: boolean;
  allowSurroundingWhitespaces: boolean;
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
  fileLinkLabel: string;
  minConditionText: string;
  errorMessagesAsJson: string;
  isSelected?: boolean;
  isEmptyValue?: boolean;
  optionId?: number;
  formFields: FormField[];
  emptyValueSelectableElements: EmptyValueSelectableElement[];
  valueOfSelectedElement: string;
  labelOfSelectedElement: string;
  valuesOfSelectedElements: string[];
  labelsOfSelectedElements: string[];
  geoStreetNumber: string;
  geoRoute: string;
  geoLocality: string;
  geoAdministrativeAreaLevel1: string;
  geoPostalCode: string;
  geoCountry: string;
  geoCountryCode: string;
  geoLat?: number;
  geoLng?: number;
  restrictToCountry?: any;
  showMap?: boolean;
  showMapOnlyAfterValueHasBeenSet?: boolean;
  allowMapControl?: boolean;
  useMapUserPosition?: boolean;
  defaultMapLat?: number;
  defaultMapLng?: number;
  defaultMapZoom?: number;
  defaultMapZoomAfterPlaceSelected?: number;
  onPlacesChangedCallback?: any;
  showSelectAsTextIfOneValueOnly?: boolean;
  showWithoutElements?: boolean;
  isMultiSelect?: boolean;
  buttonPath?: any;
  buttonWidth?: number;
  buttonHeight?: number;
  buttonValue: string;
  link?: any;
  iconCssClass: string;
  editorConfigAsJson: string;
  inputType: string;
  timeLabel: string;
  timePlaceholder: string;
}

export interface Fieldset {
  fields: Field[];
  replicationConf?: any;
  showWithNextSet: boolean;
  name: string;
  visible: boolean;
}

export interface EF_Event_Ui {
  id: string;
  name: string;
  buttons: any[];
  validators: any[];
  fieldsets: Fieldset[];
}

export interface EF_Event_Ui_Response {
  "prj-cockpitv3_event_general": EF_Event_Ui;
}
