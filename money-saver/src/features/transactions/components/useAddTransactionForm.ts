import type {
  BudgetTypeLabel,
  BudgetTypeWithLabels,
  CreateTransactionPayload,
  UserBudget,
} from "@/types";
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { TransactionServices } from "../TransactionServices";

export const useAddTransactionForm = (budgetDataRef: Ref<UserBudget | null>) => {
  const selectedBudgetTypeId = ref<number | null>(null);
  const selectedBudgetTypeLabelId = ref<number | null>(null);
  const amount = ref<string>("");
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  // Reset budget type label when budget type changes
  watch(selectedBudgetTypeId, () => {
    selectedBudgetTypeLabelId.value = null;
  });

  const isFormValid = computed(() => {
    const hasCategory = selectedBudgetTypeId.value !== null || selectedBudgetTypeLabelId.value !== null;
    const hasAmount = amount.value !== "" && parseFloat(amount.value) > 0;

    return hasCategory && hasAmount && !isSubmitting.value;
  });

  // Get all budget types from users_budget_type_labels
  const budgetTypes = computed<BudgetTypeWithLabels[]>(() => {
    const budgetData = budgetDataRef.value;
    if (!budgetData?.labels?.users_budget_type_labels) {
      return [];
    }
    return budgetData.labels.users_budget_type_labels.map(
      (userBudget) => userBudget.budget_type_with_labels,
    );
  });

  // Get available budget type labels filtered by selected budget type
  const availableBudgetTypeLabels = computed<BudgetTypeLabel[]>(() => {
    const budgetData = budgetDataRef.value;
    if (
      !budgetData?.labels?.users_budget_type_labels ||
      !selectedBudgetTypeId.value
    ) {
      return [];
    }

    const selectedUserBudget = budgetData.labels.users_budget_type_labels.find(
      (userBudget) =>
        userBudget.budget_type_with_labels.id === selectedBudgetTypeId.value,
    );

    return selectedUserBudget?.budget_type_with_labels.budget_type_labels || [];
  });

  const selectedBudget = computed(() => {
    const budgetData = budgetDataRef.value;
    if (!budgetData?.labels?.users_budget_type_labels) return null;

    const selectedUserBudget = budgetData.labels.users_budget_type_labels.find(
      (userBudget) =>
        userBudget.budget_type_with_labels.id === selectedBudgetTypeId.value,
    );

    return selectedUserBudget?.budget_type_with_labels || null;
  });

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!isFormValid.value) return;

    isSubmitting.value = true;
    error.value = null;

    try {
      const payload: CreateTransactionPayload = {
        budget_type_id: selectedBudgetTypeId.value,
        budget_type_label_id: selectedBudgetTypeLabelId.value,
        amount: parseFloat(amount.value),
      };

      await TransactionServices.createTransaction(payload);
      
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Failed to add transaction:', err);
      error.value = err.message || 'Failed to add transaction. Please try again.';
    } finally {
      isSubmitting.value = false;
    }
  };

  const resetForm = () => {
    selectedBudgetTypeId.value = null;
    selectedBudgetTypeLabelId.value = null;
    amount.value = "";
    error.value = null;
  };

  return {
    selectedBudgetTypeId,
    selectedBudgetTypeLabelId,
    amount,
    isSubmitting,
    error,
    isFormValid,
    selectedBudget,
    budgetTypes,
    availableBudgetTypeLabels,
    handleSubmit,
    resetForm,
  };
};
