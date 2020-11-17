import { countries, primaryLanguages, skillLevels, timezones } from './_data';

export const firstNameField = (val = null) => ({
  defaultValue: val,
  name: 'first_name',
  type: 'text',
  placeholder: 'Ada',
  label: 'First Name',
});

export const lastNameField = (val = null) => ({
  defaultValue: val,
  name: 'last_name',
  type: 'text',
  placeholder: 'Lovelace',
  label: 'Last Name',
});

export const emailField = (val = null) => ({
  defaultValue: val,
  name: 'email',
  type: 'email',
  placeholder: 'ada.lovelace@openmined.org',
  label: 'Email Address',
});

export const passwordField = (val = null) => ({
  defaultValue: val,
  name: 'password',
  type: 'password',
  placeholder: 'Password',
  label: 'Password',
});

export const passwordConfirmField = (val = null) => ({
  defaultValue: val,
  name: 'passwordConfirm',
  type: 'password',
  placeholder: 'Password confirmation',
});

export const readOnlyEmailField = (val = null) => ({
  defaultValue: val,
  name: 'readOnlyEmail',
  type: 'read-only',
  label: 'Email Address',
});

export const skillLevelField = (val = null) => ({
  defaultValue: val,
  name: 'skillLevel',
  type: 'radio',
  options: skillLevels,
  label: 'Which of the following best describes you?',
});

export const primaryLanguageField = (val = null) => ({
  defaultValue: val,
  name: 'primaryLanguage',
  type: 'select',
  placeholder: 'Select a Language',
  options: primaryLanguages.map((d) => ({ value: d.code, label: d.name })),
  label: 'Primary Language',
});

export const cityField = (val = null) => ({
  defaultValue: val,
  name: 'city',
  type: 'text',
  placeholder: 'Oxford',
  label: 'City',
});

export const countryField = (val = null) => ({
  defaultValue: val,
  name: 'country',
  type: 'select',
  placeholder: 'Select a Country',
  options: countries.map((d) => ({ value: d.code, label: d.name })),
  label: 'Country',
});

export const timezoneField = (val = null) => ({
  defaultValue: val,
  name: 'timezone',
  type: 'select',
  placeholder: 'Select a Timezone',
  options: timezones.map((d) => ({ value: d.offset, label: d.name })),
  label: 'Timezone',
});
