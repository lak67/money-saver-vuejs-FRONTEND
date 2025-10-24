import { computed, ref } from 'vue'

export function useSuccessView() {
  // Animation state
  const showAnimation = ref(true)
  
  // Computed properties for formatting display data
  const formatCurrency = computed(() => (total_amount: string) => {
    const numericAmount = parseFloat(total_amount)
    if (isNaN(numericAmount)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericAmount)
  })

  const formatEmail = computed(() => (email: string) => {
    if (!email) return 'Not provided'
    return email.toLowerCase()
  })

  const formatDescription = computed(() => (description: string) => {
    if (!description) return 'No description'
    return description.charAt(0).toUpperCase() + description.slice(1)
  })

  const getCurrentDateTime = computed(() => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(new Date())
  })

  // Methods
  const triggerAnimation = () => {
    showAnimation.value = false
    setTimeout(() => {
      showAnimation.value = true
    }, 100)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  const generateSummaryText = (email: string, total_amount: string, description: string) => {
    return `Expense Summary:
Email: ${formatEmail.value(email)}
Amount: ${formatCurrency.value(total_amount)}
Description: ${formatDescription.value(description)}
Date: ${getCurrentDateTime.value}`
  }

  return {
    // State
    showAnimation,

    // Computed
    formatCurrency,
    formatEmail,
    formatDescription,
    getCurrentDateTime,

    // Methods
    triggerAnimation,
    copyToClipboard,
    generateSummaryText
  }
}