import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateUserProfile(data) {
  let errors = {};

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = 'This field is required';
  }
  if (validator.isEmpty(data.last_name)) {
    errors.last_name = 'This field is required';
  }
  if (validator.isEmpty(data.displayname)) {
    errors.displayname = 'This field is required';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
if(!validator.isEmpty(data.current_password)){
    if (validator.isEmpty(data.new_password)) {
        errors.new_password = 'This field is required';
    }
    if (validator.isEmpty(data.confirm_new_password)) {
        errors.confirm_new_password = 'This field is required';
    }
    if (!validator.equals(data.new_password, data.confirm_new_password)) {
        errors.confirm_new_password = 'Passwords must match';
    }
}

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}