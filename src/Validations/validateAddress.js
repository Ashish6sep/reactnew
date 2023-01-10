import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateAddress(data) {
  let errors = {};

  if (validator.isEmpty(data.shipping_first_name)) {
    errors.shipping_first_name = 'This field is required';
  }
  if (validator.isEmpty(data.shipping_last_name)) {
    errors.shipping_last_name = 'This field is required';
  }
  // if (validator.isEmpty(data.shipping_company)) {
  //   errors.shipping_company = 'This field is required';
  // }
  if (validator.isEmpty(data.shipping_country)) {
    errors.shipping_country = 'This field is required';
  }
  if (validator.isEmpty(data.shipping_address_1)) {
    errors.shipping_address_1 = 'This field is required';
  }
  if (validator.isEmpty(data.shipping_city)) {
    errors.shipping_city = 'This field is required';
  }
  if (validator.isEmpty(data.shipping_state)) {
    errors.shipping_state = 'This field is required';
  }
  if (validator.isEmpty(data.shipping_zip)) {
    errors.shipping_zip = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}