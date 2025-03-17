declare namespace App.Data {
export type AccommodationData = {
id: number | null;
type_id: number;
place_id: string;
name: string;
street: string;
zip: string;
city: string;
coordinates: any | null;
country_id: number;
region_id: number;
latitude: number | null;
longitude: number | null;
website: string;
phone: string;
email: string;
};
export type AccommodationTypeData = {
id: number;
description: string;
title: string;
};
export type BookingPolicyData = {
id: number | null;
name: string;
is_default: boolean;
age_min: number | null;
arrival_days: Array<any> | null;
departure_days: Array<any> | null;
stay_min: number | null;
stay_max: number | null;
checkin: string | null;
checkout: string | null;
};
export type CalendarData = {
id: number | null;
name: string;
icon: string;
color: string;
is_default: boolean;
events: Array<App.Data.CalendarEventData> | null;
};
export type CalendarEventData = {
id: number | null;
title: string;
description: string;
start_at: string;
end_at: string;
color: string;
calendar_id: number;
accommodation_id: number | null;
};
export type ContactData = {
id: number | null;
name: string;
first_name: string | null;
company_name: string | null;
company_id: number | null;
full_name: string;
reverse_full_name: string;
initials: string;
title_id: number | null;
salutation_id: number | null;
creditor_number: string | null;
is_favorite: boolean | null;
debtor_number: string | null;
primary_mail: string | null;
vat_id: string | null;
register_court: string | null;
register_number: string | null;
department: string | null;
position: string | null;
tax_number: string | null;
company: App.Data.ContactData | null;
title: App.Data.TitleData | null;
salutation: App.Data.SalutationData | null;
payment_deadline: App.Data.PaymentDeadlineData | null;
mails: Array<App.Data.ContactMailData> | null;
};
export type ContactMailData = {
id: number | null;
contact_id: number;
email: string;
pos: number;
category: App.Data.EmailCategoryData | null;
};
export type CountryData = {
id: number;
name: string;
iso_code: string;
vehicle_code: string;
country_code: string;
};
export type EmailCategoryData = {
id: number | null;
name: string;
type: number | null;
};
export type InboxData = {
id: number | null;
name: string;
is_default: boolean;
email_address: string;
};
export type PaymentDeadlineData = {
id: number | null;
name: string;
days: number | null;
is_immediately: boolean | null;
is_default: boolean | null;
};
export type RegionData = {
id: number;
country_id: number;
name: string;
short_name: string;
place_short_name: string;
};
export type SalutationData = {
id: number | null;
name: string;
is_hidden: boolean;
gender: string;
};
export type SeasonData = {
id: number | null;
name: string;
is_default: boolean;
color: string | null;
booking_mode: number;
has_season_related_restrictions: boolean;
periods: Array<App.Data.SeasonPeriodData> | null;
};
export type SeasonPeriodData = {
id: number | null;
season_id: number;
begin_on: string;
end_on: string;
};
export type TenantData = {
first_name: string;
last_name: string;
organisation: string;
email: string;
website: string;
subdomain: string;
prefix: string;
formated_prefix: string;
};
export type TitleData = {
id: number | null;
name: string;
is_default: boolean;
correspondence_salutation_male: string;
correspondence_salutation_female: string;
correspondence_salutation_other: string;
};
export type UserData = {
id: number | null;
first_name: string;
last_name: string;
avatar_url: string | null;
is_admin: boolean;
email: string;
full_name: string;
reverse_full_name: string;
initials: string;
user_agent: string | null;
email_verified_at: string | null;
};
}
