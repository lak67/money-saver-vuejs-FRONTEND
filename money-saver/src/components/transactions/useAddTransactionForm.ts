import type { UserBudget } from '@/services/budget/BudgetServices';
import { computed, ref } from 'vue';

export interface AddTransactionPayload {
  budgetTypeId: string;
  amount: number;
}

export const useAddTransactionForm = (budgets: UserBudget[]) => {
  const selectedBudgetTypeId = ref<string>('');
    const amount = ref<string>('');
    

  const isFormValid = computed(() => {
      return (
          selectedBudgetTypeId.value !== '' &&
          amount.value !== '' &&
          parseFloat(amount.value) > 0
      );
  });

    const selectedBudget = computed(() => {
        return budgets.find((b) => b.budget_type_id === selectedBudgetTypeId.value);
    });

  const handleSubmit = (callback: (payload: AddTransactionPayload) => void) => {
    if (!isFormValid.value) return;

    callback({
      budgetTypeId: selectedBudgetTypeId.value,
      amount: parseFloat(amount.value),
    });

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    selectedBudgetTypeId.value = '';
    amount.value = '';
  };

  return {
    selectedBudgetTypeId,
    amount,
    isFormValid,
    selectedBudget,
    handleSubmit,
    resetForm,
  };
};
