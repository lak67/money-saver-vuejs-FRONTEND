import { computed, ref } from "vue";
import type { BudgetType, SelectedBudgetType } from "../../useRegisterModal";

export function useBudgetAmountsView() {
  // Local state
  const showRecommendations = ref(true);

  // Computed properties
  const getTotalBudgetAmount = computed(
    () => (budgetAmounts: SelectedBudgetType[]) => {
      return budgetAmounts.reduce((total, budget) => {
        const amount = parseInt(String(budget.total_amount)) || 0;
        return total + amount;
      }, 0);
    }
  );

  const getBudgetTypeById = computed(
    () => (budgetTypeId: string, availableTypes: BudgetType[]) => {
      return availableTypes.find((type) => type.id === budgetTypeId);
    }
  );

  const formatCurrency = computed(() => (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "$0.00";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  });

  const clearAllAmounts = (
    budgetAmounts: SelectedBudgetType[],
    updateBudgetAmount: (budgetTypeId: string, amount: string) => void
  ) => {
    budgetAmounts.forEach((budget) => {
      updateBudgetAmount(budget.id, "");
    });
  };

  return {
    // State
    showRecommendations,

    // Computed
    getTotalBudgetAmount,
    getBudgetTypeById,
    formatCurrency,

    // Methods
    clearAllAmounts,
  };
}
