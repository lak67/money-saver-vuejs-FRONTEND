import { computed, ref } from 'vue'

export function useInputView() {
  // Local reactive state for form validation
  const amountError = ref('')
  const descriptionError = ref('')

  // Validation computed properties
  const isAmountValid = computed(() => (amount: string) => {
    const numericAmount = parseFloat(amount)
    return !isNaN(numericAmount) && numericAmount > 0
  })

  const isDescriptionValid = computed(() => (description: string) => {
    return description.trim().length >= 3
  })

  const formatAmount = computed(() => (amount: string) => {
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount)) return amount
    return numericAmount.toFixed(2)
  })

  const getAmountErrorMessage = computed(() => (amount: string) => {
    if (!amount.trim()) return 'Amount is required'
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount)) return 'Please enter a valid number'
    if (numericAmount <= 0) return 'Amount must be greater than 0'
    return ''
  })

  const getDescriptionErrorMessage = computed(() => (description: string) => {
    if (!description.trim()) return 'Description is required'
    if (description.trim().length < 3) return 'Description must be at least 3 characters'
    return ''
  })

  // Methods
  const validateAmount = (amount: string) => {
    amountError.value = getAmountErrorMessage.value(amount)
    return amountError.value === ''
  }

  const validateDescription = (description: string) => {
    descriptionError.value = getDescriptionErrorMessage.value(description)
    return descriptionError.value === ''
  }

  const validateForm = (amount: string, description: string) => {
    const isAmountValidResult = validateAmount(amount)
    const isDescriptionValidResult = validateDescription(description)
    return isAmountValidResult && isDescriptionValidResult
  }

  const clearErrors = () => {
    amountError.value = ''
    descriptionError.value = ''
  }

  // Generate expense categories for suggestions
  const expenseCategories = ref([
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Personal Care',
    'Other'
  ])

  return {
    // State
    amountError,
    descriptionError,
    expenseCategories,

    // Computed
    isAmountValid,
    isDescriptionValid,
    formatAmount,
    getAmountErrorMessage,
    getDescriptionErrorMessage,

    // Methods
    validateAmount,
    validateDescription,
    validateForm,
    clearErrors
  }
}