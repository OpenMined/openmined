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
  name: 'password_confirm',
  type: 'password',
  placeholder: 'Password confirmation',
});

export const readOnlyEmailField = (val = null, helper) => ({
  defaultValue: val,
  name: 'read-only-email',
  type: 'read-only',
  label: 'Email Address',
  helper,
});

export const descriptionField = (val = null) => ({
  defaultValue: val,
  name: 'description',
  type: 'text',
  placeholder: 'Write a brief description about yourself...',
  label: 'About You',
});

export const websiteField = (val = null) => ({
  defaultValue: val,
  name: 'website',
  type: 'text',
  placeholder: 'https://www.example.com',
  label: 'Website',
});

export const readOnlyGithubField = (val = null, helper) => ({
  defaultValue: val,
  name: 'read-only-github',
  type: 'read-only',
  label: 'Github',
  helper,
});

export const twitterField = (val = null) => ({
  defaultValue: val,
  name: 'twitter',
  type: 'text',
  left: '@',
  placeholder: 'openminedorg',
  label: 'Twitter',
});

export const skillLevelField = (val = null) => ({
  defaultValue: val,
  name: 'skill_level',
  type: 'radio',
  options: skillLevels,
  label: 'Which of the following best describes you?',
});

export const primaryLanguageField = (val = null) => ({
  defaultValue: val,
  name: 'primary_language',
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
  options: timezones.map((d) => d.name),
  label: 'Timezone',
});
