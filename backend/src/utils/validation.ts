export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/
  return mobileRegex.test(mobile)
}

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' }
  }
  return { valid: true }
}

export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^\d{12}$/
  return aadhaarRegex.test(aadhaar)
}

export const validateIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  return ifscRegex.test(ifsc)
}

export const validatePinCode = (pinCode: string): boolean => {
  const pinCodeRegex = /^\d{6}$/
  return pinCodeRegex.test(pinCode)
}
