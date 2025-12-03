<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserBudget } from '@/services/budget/BudgetServices';
import { useAddTransactionForm } from './useAddTransactionForm';

interface Props {
    budgets: UserBudget[];
    isLoading?: boolean;
}

interface Emits {
    (e: 'submit', payload: { budgetTypeId: string; amount: number }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const {
    selectedBudgetTypeId,
    amount,
    isFormValid,
    selectedBudget,
    handleSubmit,
} = useAddTransactionForm(props.budgets);

const onSubmit = () => {
    handleSubmit((payload) => emit('submit', payload));
};
</script>

<template>
    <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-foreground mb-4">Add Transaction</h2>

        <form @submit.prevent="onSubmit" class="space-y-4">
            <!-- Budget Type Dropdown -->
            <div class="space-y-2">
                <Label for="budget-type">Select Budget Type</Label>
                <select id="budget-type" v-model="selectedBudgetTypeId"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                    :disabled="isLoading || budgets.length === 0">
                    <option value="" disabled>
                        {{ budgets.length === 0 ? 'No budget types available' : 'Select budget type' }}
                    </option>
                    <option v-for="budget in budgets" :key="budget.budget_type_id" :value="budget.budget_type_id">
                        {{ budget.budget_type_icon }} {{ budget.budget_type_name }}
                    </option>
                </select>
            </div>

            <!-- Budget Type Label (locked until budget type selected) -->
            <div class="space-y-2">
                <Label for="budget-type-label">Budget Type Label</Label>
                <select id="budget-type-label"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                    :disabled="!selectedBudgetTypeId || isLoading">
                    <option value="" disabled selected>
                        {{ selectedBudgetTypeId ? 'Select budget type label' : 'Select budget type first' }}
                    </option>
                </select>
                <p v-if="selectedBudget" class="text-xs text-muted-foreground">
                    Remaining: ${{ (selectedBudget.weekly_amount - selectedBudget.spent_this_week).toFixed(2) }}
                </p>
            </div>

            <!-- Amount Input -->
            <div class="space-y-2">
                <Label for="amount">Enter Amount</Label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input id="amount" v-model="amount" type="number" step="0.01" min="0.01" placeholder="0.00"
                        class="pl-7" :disabled="isLoading" />
                </div>
            </div>

            <!-- Submit Button -->
            <Button type="submit" class="w-full" :disabled="!isFormValid || isLoading">
                <span v-if="isLoading">Adding...</span>
                <span v-else>Add Transaction →</span>
            </Button>
        </form>
    </div>
</template>
