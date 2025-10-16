import { computed, ref } from 'vue'
import type { BudgetAmount, BudgetType } from '../../useRegisterModal'

export function useBudgetAmountsView() {
  // Local state
  const totalIncomeRef = ref('')
  const showPercentages = ref(false)
  const showRecommendations = ref(true)

  // Recommended percentages for budget allocation
  const recommendedPercentages = ref<Record<string, number>>({
    'rent': 30,        // 30% for housing
    'utilities': 10,   // 10% for utilities
    'groceries': 15,   // 15% for food
    'savings': 20,     // 20% for savings
    'transportation': 15, // 15% for transportation
    'insurance': 5,    // 5% for insurance
    'entertainment': 5 // 5% for entertainment
  })

  // Computed properties
  const getTotalBudgetAmount = computed(() => (budgetAmounts: BudgetAmount[]) => {
    return budgetAmounts.reduce((total, budget) => {
      const amount = parseInt(String(budget.amount)) || 0
      return total + amount
    }, 0)
  })

  const getPercentageOfIncome = computed(() => (amount: string, totalIncome: string) => {
    const numAmount = parseFloat(amount) || 0
    const numIncome = parseFloat(totalIncome) || 0
    
    if (numIncome === 0) return 0
    return Math.round((numAmount / numIncome) * 100)
  })

  const getRecommendedAmount = computed(() => (budgetTypeId: string, totalIncome: string) => {
    const percentage = recommendedPercentages.value[budgetTypeId] || 10
    const income = parseFloat(totalIncome) || 0
    return Math.round((income * percentage) / 100)
  })

  const getBudgetTypeById = computed(() => (budgetTypeId: string, availableTypes: BudgetType[]) => {
    return availableTypes.find(type => type.id === budgetTypeId)
  })

  const formatCurrency = computed(() => (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '$0.00'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount)
  })

  const validateAmounts = computed(() => (budgetAmounts: BudgetAmount[]) => {
    return budgetAmounts.every(budget => {
      const amount = parseInt(String(budget.amount))
      return !isNaN(amount) && amount > 0
    })
  })

  const getIncomeRemaining = computed(() => (budgetAmounts: BudgetAmount[], totalIncome: string) => {
    const totalBudget = getTotalBudgetAmount.value(budgetAmounts)
    const income = parseFloat(totalIncome) || 0
    return Math.max(0, income - totalBudget)
  })

  // Methods
  const applyRecommendedPercentages = (
    budgetAmounts: BudgetAmount[], 
    totalIncome: string,
    updateBudgetAmount: (budgetTypeId: string, amount: string) => void
  ) => {
    budgetAmounts.forEach(budget => {
      const recommendedAmount = getRecommendedAmount.value(budget.budgetTypeId, totalIncome)
      updateBudgetAmount(budget.budgetTypeId, recommendedAmount.toString())
    })
  }

  const distributeEquallyPercentages = (
    budgetAmounts: BudgetAmount[],
    totalIncome: string,
    updateBudgetAmount: (budgetTypeId: string, amount: string) => void
  ) => {
    const income = parseFloat(totalIncome) || 0
    const equalPercentage = Math.floor(100 / budgetAmounts.length)
    const equalAmount = Math.floor((income * equalPercentage) / 100)

    budgetAmounts.forEach(budget => {
      updateBudgetAmount(budget.budgetTypeId, equalAmount.toString())
    })
  }

  const clearAllAmounts = (
    budgetAmounts: BudgetAmount[],
    updateBudgetAmount: (budgetTypeId: string, amount: string) => void
  ) => {
    budgetAmounts.forEach(budget => {
      updateBudgetAmount(budget.budgetTypeId, '')
    })
  }

  return {
    // State
    totalIncomeRef,
    showPercentages,
    showRecommendations,
    recommendedPercentages,

    // Computed
    getTotalBudgetAmount,
    getPercentageOfIncome,
    getRecommendedAmount,
    getBudgetTypeById,
    formatCurrency,
    validateAmounts,
    getIncomeRemaining,

    // Methods
    applyRecommendedPercentages,
    distributeEquallyPercentages,
    clearAllAmounts
  }
}