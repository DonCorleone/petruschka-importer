import { EF_Event_Ui } from '../models/EF_Event_UI';
import { Event_Ui_Props } from '../models/Event_Ui_Props';

export default function getPropertiesFromJson2(
  eventUi: EF_Event_Ui
): Event_Ui_Props {
  return {
    title: eventUi.fieldsets
      .find((p) => p.name == 'prj-cockpitv3_event_general')
      ?.fields.find((f) => f.name == 'eventBasic_title')?.value,
    shortDesc: eventUi.fieldsets
      .find((p) => p.name == 'descriptionForm')
      ?.fields.find((f) => f.name == 'eventBasic_shortDescription')?.value,
    description: eventUi.fieldsets
      .find((p) => p.name == 'descriptionForm')
      ?.fields.find((f) => f.name == 'eventBasic_description')?.value
  };
}
