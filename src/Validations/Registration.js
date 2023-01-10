import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateSignup(data) {
  let errors = {};

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = 'This field is required';
  }
  if (validator.isEmpty(data.last_name)) {
    errors.last_name = 'This field is required';
  }
  if (validator.isEmpty(data.username)) {
    errors.username = 'This field is required';
  }
  if (!validator.isEmail(data.username)) {
    errors.username = 'Username should be an email address';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }

  if (data.haveExistsUser == 0) {
    if (validator.isEmpty(data.confirm_password)) {
      errors.confirm_password = 'This field is required';
    }
    if (data.password != data.confirm_password) {
      errors.confirm_password = 'Confirm password not match';
    }
  }

  if (validator.isEmpty(data.phone)) {
    errors.phone = 'This field is required';
  }

  if (validator.isEmpty(data.street)) {
    errors.street = 'This field is required';
  }
  if (validator.isEmpty(data.city)) {
    errors.city = 'This field is required';
  }
  if (validator.isEmpty(data.country)) {
    errors.country = 'This field is required';
  }
  if (validator.isEmpty(data.state)) {
    errors.state = 'This field is required';
  }
  if (validator.isEmpty(data.postcode)) {
    errors.postcode = 'This field is required';
  }
  if (validator.isEmpty(data.social_security_no)) {
    errors.social_security_no = 'This field is required';
  }
  if (validator.isEmpty(data.paypal_account)) {
    errors.paypal_account = 'This field is required';
  }
  if (validator.isEmpty(data.business_name)) {
    errors.business_name = 'This field is required';
  }
  if (validator.isEmpty(data.is_corporation)) {
    errors.is_corporation = 'This field is required';
  }

  if (validator.isEmpty(data.affiliate_agreement)) {
    errors.affiliate_agreement = 'You must agree with affiliate agreement';
  }
  if (validator.isEmpty(data.terms_of_service_agree)) {
    errors.terms_of_service_agree = 'You must agree with terms of service';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid: isEmpty(errors)
  }
}