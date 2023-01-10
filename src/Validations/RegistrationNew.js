import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateSignup(data,state={}) {
  let errors = {};

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = 'This field is required';
  }

  if (validator.isEmpty(data.last_name)) {
    errors.last_name = 'This field is required';
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
  if (validator.isEmpty(data.paypal_account)) {
    errors.paypal_account = 'This field is required';
  }
  
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
     // errors.w9_country = 'This field is required';
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

  if (state.isEnableHowYouKnow=='yes'){

    if(validator.isEmpty(state.how_you_know)){
      errors.how_you_know = 'This field is required';
    }
    if(validator.isEmpty(state.how_you_know)==false && (state.isKnowOthers)  &&  validator.isEmpty(state.how_you_know_others)){
      errors.how_you_know_others = 'This field is required';
    }
  }

  
  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid: isEmpty(errors)
  }
}