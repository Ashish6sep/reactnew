import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validatePaypalEmail(data) {
  let errors = {};

  if (validator.isEmpty(data.active_email)) {
    errors.active_email = 'This field is required';
  }
  if (!validator.isEmail(data.active_email)) {
    errors.active_email = 'Email is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}