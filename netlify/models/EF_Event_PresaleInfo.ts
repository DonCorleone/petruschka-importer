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

    export interface Fieldset {
        fields: Field[];
        replicationConf?: any;
        showWithNextSet: boolean;
        name: string;
        visible: boolean;
    }

    export interface PrjCockpitv3EventAgendainfo {
        id: string;
        name: string;
        buttons: any[];
        validators: any[];
        fieldsets: Fieldset[];
    }

    export interface EF_PresaleInfo_Response {
        'prj-cockpitv3_event_agendainfo': PrjCockpitv3EventAgendainfo;
    }
    