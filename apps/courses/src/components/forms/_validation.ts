import * as yup from 'yup';

export const validEmail = yup.string().email().required();
export const validPassword = yup.string().min(7);
export const validMatchingPassword = (pw) =>
  yup.string().oneOf([yup.ref(pw), null], 'Passwords must match');
export const requiredString = yup.string().required();
export const arraySize = (min, max) =>
  yup.array().required().compact().min(min).max(max);
