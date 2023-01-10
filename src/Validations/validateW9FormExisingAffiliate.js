import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateSignup(data) {
  let errors = {};
  
  if (validator.isEmpty(data.type)) {
    errors.type = 'This field is required';
  }
  
  // US Individual or Business Form Information Validation
  if (data.type == 'usa' && validator.isEmpty(data.is_business)) {
    errors.is_business = 'This field is required';
  }
  
  if (data.type == 'usa') {

    if(validator.isEmpty(data.name)) {
      errors.name = 'This field is required';
    }   
    if(validator.isEmpty(data.number)) {
      errors.number = 'This field is required';
    }

    if(data.is_business === 'yes' && !validator.isLength(data.number, {min:10, max: 15})) {
      errors.number = 'This field length is 9';
    }
    if(data.is_business === 'no' && !validator.isLength(data.number, {min:11, max: 15})) {
      errors.number = 'This field length is 9';
    }

    if (validator.isEmpty(data.address_1)) {
      errors.address_1 = 'This field is required';
    }
  
    if (validator.isEmpty(data.w9_city)) {
      errors.w9_city = 'This field is required';
    }
  
    if (validator.isEmpty(data.w9_country)) {
      errors.w9_country = 'This field is required';
    }
  
    if (validator.isEmpty(data.w9_state)) {
      errors.w9_state = 'This field is required';
    }
  
    if (validator.isEmpty(data.w9_postcode)) {
      errors.w9_postcode = 'This field is required';
    }
    
    if (validator.isEmpty(data.classification)) {
      errors.classification = 'This field is required';
    }
  
    if (validator.isEmpty(data.is_information_provided)) {
      errors.is_information_provided = 'This field is required';
    }
  
    if (validator.isEmpty(data.penalties_perjury)) {
      errors.penalties_perjury = 'This field is required';
    }

  }

  // Canadian Individual or Business Form Information Validation
  if (data.type == 'canadian') {

    if(validator.isEmpty(data.canadian_goods_services_tax_status)) {
      errors.canadian_goods_services_tax_status = 'This field is required';
    }

    if(data.canadian_goods_services_tax_status=='yes') {
      if(validator.isEmpty(data.canadian_gst_account)) {
        errors.canadian_gst_account = 'This field is required';
      }
      
      if(validator.isEmpty(data.canadian_gst_account_number)) {
        errors.canadian_gst_account_number = 'This field is required';
      }
      
      if(validator.isEmpty(data.canadian_gst_completed)) {
        errors.canadian_gst_completed = 'This field is required';
      }
    }
    
  }
    

  // Others Individual or Business Form Information Validation
  if (data.type == 'other') {
    if (validator.isEmpty(data.w9_country)) {
      errors.w9_country = 'This field is required';
    }
  
    if (validator.isEmpty(data.w9_state)) {
      errors.w9_state = 'This field is required';
    }

  }

  if(validator.isEmpty(data.affiliate_agreement)) {
    errors.affiliate_agreement = 'This field is required';
  }

  if(validator.isEmpty(data.terms_of_service_agree)) {
    errors.terms_of_service_agree = 'This field is required';
  }

  // Signature validation
  if(validator.isEmpty(data.signature)){
    errors.signature = 'This field is required';
  }
    
  
  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid: isEmpty(errors)
  }
}