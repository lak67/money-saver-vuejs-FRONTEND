import type {
  BudgetTypeLabel,
  BudgetTypeWithLabels,
  UserBudget,
} from "@/types";
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";

export interface AddTransactionPayload {
  budgetTypeId: number;
  budgetTypeLabelId: number;
  amount: number;
}

export const useAddTransactionForm = (budgetDataRef: Ref<UserBudget | null>) => {
  const selectedBudgetTypeId = ref<number | null>(null);
  const selectedBudgetTypeLabelId = ref<number | null>(null);
  const amount = ref<string>("");

  // Reset budget type label when budget type changes
  watch(selectedBudgetTypeId, () => {
    selectedBudgetTypeLabelId.value = null;
  });

  const isFormValid = computed(() => {
    const hasLabels = availableBudgetTypeLabels.value.length > 0;
    const isLabelValid = hasLabels ? selectedBudgetTypeLabelId.value !== null : true;

    return (
      selectedBudgetTypeId.value !== null &&
      isLabelValid &&
      amount.value !== "" &&
      parseFloat(amount.value) > 0
    );
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

  const handleSubmit = (callback: (payload: AddTransactionPayload) => void) => {
    if (
      !isFormValid.value ||
      selectedBudgetTypeId.value === null ||
      selectedBudgetTypeLabelId.value === null
    )
      return;

    callback({
      budgetTypeId: selectedBudgetTypeId.value,
      budgetTypeLabelId: selectedBudgetTypeLabelId.value,
      amount: parseFloat(amount.value),
    });

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    selectedBudgetTypeId.value = null;
    selectedBudgetTypeLabelId.value = null;
    amount.value = "";
  };

  return {
    selectedBudgetTypeId,
    selectedBudgetTypeLabelId,
    amount,
    isFormValid,
    selectedBudget,
    budgetTypes,
    availableBudgetTypeLabels,
    handleSubmit,
    resetForm,
  };
};
