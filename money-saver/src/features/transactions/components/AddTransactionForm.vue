<script setup lang="ts">
import { toRef, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserBudget } from '@/types';
import { useAddTransactionForm } from './useAddTransactionForm';

interface Props {
    budgets: UserBudget | null;
    isLoading?: boolean;
}

interface Emits {
    (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const {
    selectedBudgetTypeId,
    selectedBudgetTypeLabelId,
    amount,
    isSubmitting,
    error,
    isFormValid,
    selectedBudget,
    availableBudgetTypeLabels,
    handleSubmit,
} = useAddTransactionForm(toRef(props, 'budgets'));

const onSubmit = async () => {
    await handleSubmit(() => emit('success'));
};

const combinedLoading = computed(() => props.isLoading || isSubmitting.value);
</script>

<template>
    <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-foreground mb-4">Add Transaction</h2>

        <form @submit.prevent="onSubmit" class="space-y-4">
            <!-- Error Message -->
            <div v-if="error" class="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
                {{ error }}
            </div>

            <!-- Budget Type Dropdown -->
            <div class="space-y-2">
                <Label for="budget-type">Select Budget Type</Label>
                <select id="budget-type" v-model.number="selectedBudgetTypeId"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                    :disabled="combinedLoading || !budgets || budgets?.labels?.users_budget_type_labels?.length === 0">
                    <option :value="null" disabled>
                        {{ !budgets || budgets?.labels?.users_budget_type_labels?.length === 0
                            ?
                            'No budget types available' :
                            'Select budget type' }}
                    </option>
                    <option v-for="budget in budgets?.labels?.users_budget_type_labels" :key="budget.id"
                        :value="budget.id">
                        {{ budget.budget_type_with_labels.budget_type }}
                    </option>
                </select>
            </div>

            <!-- Budget Type Label (locked until budget type selected, shown only if labels exist) -->
            <div 
                class="overflow-hidden transition-all duration-300 ease-in-out"
                :class="[
                    availableBudgetTypeLabels.length > 0 ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                ]"
            >
                <div class="space-y-2">
                    <Label for="budget-type-label">Budget Type Label</Label>
                    <select id="budget-type-label" v-model.number="selectedBudgetTypeLabelId"
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                        :disabled="!selectedBudgetTypeId || combinedLoading">
                        <option :value="null" disabled>
                            Select budget type label
                        </option>
                        <option v-for="label in availableBudgetTypeLabels" :key="label.id" :value="label.id">
                            {{ label.label_name }}
                        </option>
                    </select>
                </div>
            </div>

            <p v-if="selectedBudget && availableBudgetTypeLabels.length === 0 && selectedBudgetTypeId" class="text-xs text-muted-foreground mt-2">
                {{ selectedBudget.description }}
            </p>

            <!-- Amount Input -->
            <div class="space-y-2">
                <Label for="amount">Enter Amount</Label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input id="amount" v-model="amount" type="number" step="0.01" min="0.01" placeholder="0.00"
                        class="pl-7" :disabled="combinedLoading" />
                </div>
            </div>

            <!-- Submit Button -->
            <Button type="submit" class="w-full" :disabled="!isFormValid || combinedLoading">
                <span v-if="combinedLoading">Adding...</span>
                <span v-else>Add Transaction →</span>
            </Button>
        </form>
    </div>
</template>
