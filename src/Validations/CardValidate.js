import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function CardValidate(data) {

  let errors = {};

  if (validator.isEmpty(data.name_on_card)) {
      errors.name_on_card = 'This field is required';
  }
  if (validator.isEmpty(data.card_number)) {
      errors.card_number = 'This field is required';
  }
  if (validator.isEmpty(data.expire_month)) {
      errors.expire_month = 'This field is required';
  }
  if (validator.isEmpty(data.expire_year)) {
      errors.expire_year = 'This field is required';
  }
  if (validator.isEmpty(data.cvv)) {
      errors.cvv = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}