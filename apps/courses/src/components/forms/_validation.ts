import * as yup from 'yup';

const matchingPasswordMessage = 'Passwords must match';
const oneOfMessage = 'Must be one of the selected values';

export const validEmail = yup.string().email().required();
export const validPassword = yup.string().min(7);
export const validMatchingPassword = (pw) =>
  yup.string().oneOf([yup.ref(pw), null], matchingPasswordMessage);
export const optionalString = yup.string();
export const requiredString = optionalString.required();
export const optionalUrl = yup.string().url();
export const requiredUrl = optionalUrl.required();
export const arraySize = (min, max) =>
  yup.array().required().compact().min(min).max(max);
export const requiredItem = (items) =>
  yup.string().required().oneOf(items, oneOfMessage);
export const optionalItem = (items) =>
  yup.string().oneOf(['', ...items], oneOfMessage);
