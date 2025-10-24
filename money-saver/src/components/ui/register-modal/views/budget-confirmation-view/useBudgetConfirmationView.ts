import { computed, ref } from 'vue'
import type { BudgetAmount, BudgetType } from '../../useRegisterModal'

export function useBudgetConfirmationView() {
  // Local state
  const isSubmitting = ref(false)
  const confirmationChecked = ref(false)

  // Computed properties
  const getTotalBudgetAmount = computed(() => (budgetAmounts: BudgetAmount[]) => {
    return budgetAmounts.reduce((total, budget) => {
      const amount = parseInt(String(budget.total_amount)) || 0
      return total + amount
    }, 0)
  })

  const formatCurrency = computed(() => (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseInt(amount) : amount
    if (isNaN(numAmount)) return '$0.00'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount)
  })

  const getBudgetTypeById = computed(() => (budgetTypeId: string, availableTypes: BudgetType[]) => {
    return availableTypes.find(type => type.id === budgetTypeId)
  })

  const getBudgetSummary = computed(() => (
    email: string,
    budgetAmounts: BudgetAmount[],
    availableTypes: BudgetType[]
  ) => {
    const totalAmount = getTotalBudgetAmount.value(budgetAmounts)
    const budgetCount = budgetAmounts.length
    
    const summary = {
      email,
      totalAmount,
      budgetCount,
      budgets: budgetAmounts.map(budget => {
        const budgetType = getBudgetTypeById.value(budget.budgetTypeId, availableTypes)
        return {
          id: budget.budgetTypeId,
          name: budgetType?.name || 'Unknown',
          icon: budgetType?.icon || '📊',
          total_amount: parseInt(String(budget.total_amount)) || 0,
          formattedAmount: formatCurrency.value(budget.total_amount)
        }
      }).sort((a, b) => b.total_amount - a.total_amount) // Sort by amount descending
    }
    
    return summary
  })

  const generateBudgetText = computed(() => (
    email: string,
    budgetAmounts: BudgetAmount[],
    availableTypes: BudgetType[]
  ) => {
    const summary = getBudgetSummary.value(email, budgetAmounts, availableTypes)
    
    let text = `Budget Plan Summary\n`
    text += `Email: ${email}\n`
    text += `Total Monthly Budget: ${formatCurrency.value(summary.totalAmount)}\n`
    text += `Categories: ${summary.budgetCount}\n\n`
    text += `Budget Breakdown:\n`
    
    summary.budgets.forEach(budget => {
      text += `${budget.icon} ${budget.name}: ${budget.formattedAmount}\n`
    })
    
    text += `\nCreated: ${new Date().toLocaleDateString()}`
    
    return text
  })

  const resetConfirmation = () => {
    confirmationChecked.value = false
    isSubmitting.value = false
  }

  return {
    // State
    isSubmitting,
    confirmationChecked,

    // Computed
    getTotalBudgetAmount,
    formatCurrency,
    getBudgetTypeById,
    getBudgetSummary,
    generateBudgetText,

    // Methods
    resetConfirmation
  }
}