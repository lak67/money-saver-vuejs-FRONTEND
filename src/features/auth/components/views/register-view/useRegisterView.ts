import { computed, ref } from 'vue'

export function useRegisterView() {
  // Local reactive state for form validation
  const emailError = ref('')
  const passwordError = ref('')

  // Validation computed properties
  const isEmailValid = computed(() => (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  })

  const isPasswordValid = computed(() => (password: string) => {
    return password.length >= 6
  })

  const getEmailErrorMessage = computed(() => (email: string) => {
    if (!email.trim()) return 'Email is required'
    if (!isEmailValid.value(email)) return 'Please enter a valid email address'
    return ''
  })

  const getPasswordErrorMessage = computed(() => (password: string) => {
    if (!password.trim()) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return ''
  })

  // Methods
  const validateEmail = (email: string) => {
    emailError.value = getEmailErrorMessage.value(email)
    return emailError.value === ''
  }

  const validatePassword = (password: string) => {
    passwordError.value = getPasswordErrorMessage.value(password)
    return passwordError.value === ''
  }

  const validateForm = (email: string, password: string) => {
    const isEmailValidResult = validateEmail(email)
    const isPasswordValidResult = validatePassword(password)
    return isEmailValidResult && isPasswordValidResult
  }

  const clearErrors = () => {
    emailError.value = ''
    passwordError.value = ''
  }

  return {
    // State
    emailError,
    passwordError,

    // Computed
    isEmailValid,
    isPasswordValid,
    getEmailErrorMessage,
    getPasswordErrorMessage,

    // Methods
    validateEmail,
    validatePassword,
    validateForm,
    clearErrors
  }
}