import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateBillingAddress(data) {
  let errors = {};

  if (validator.isEmpty(data.billing_first_name)) {
    errors.billing_first_name = 'This field is required';
  }
  if (validator.isEmpty(data.billing_last_name)) {
    errors.billing_last_name = 'This field is required';
  }
  if (validator.isEmpty(data.billing_country)) {
    errors.billing_country = 'This field is required';
  }
  if (validator.isEmpty(data.billing_address_1)) {
    errors.billing_address_1 = 'This field is required';
  }
  if (validator.isEmpty(data.billing_city)) {
    errors.billing_city = 'This field is required';
  }
  if (validator.isEmpty(data.billing_state)) {
    errors.billing_state = 'This field is required';
  }
  if (validator.isEmpty(data.billing_postcode)) {
    errors.billing_postcode = 'This field is required';
  }
  if (validator.isEmpty(data.billing_phone)) {
    errors.billing_phone = 'This field is required';
  }
  if (validator.isEmpty(data.billing_email)) {
    errors.billing_email = 'This field is required';
  }
  if (!validator.isEmail(data.billing_email)) {
    errors.billing_email = 'Paypal Email is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}