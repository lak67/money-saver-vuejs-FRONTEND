<template>
    <div class="space-y-4">
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Set Your Monthly Budget</h3>
            <p class="text-sm text-muted-foreground">
                Enter the monthly amount for each budget category you selected
            </p>
        </div>

        <div class="space-y-3">
            <div v-for="budgetTypeId in selectedBudgetTypes" :key="budgetTypeId" class="space-y-2">
                <div class="flex items-center gap-2">
                    <span>{{ getBudgetType(budgetTypeId)?.icon }}</span>
                    <Label :for="budgetTypeId">{{ getBudgetType(budgetTypeId)?.name }}</Label>
                </div>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input :id="budgetTypeId" type="number" :value="getBudgetAmount(budgetTypeId)"
                        @input="handleAmountUpdate(budgetTypeId, $event)" placeholder="0" class="pl-6" min="0"
                        step="10" />
                </div>
                <p class="text-xs text-muted-foreground">
                    {{ getBudgetType(budgetTypeId)?.description }}
                </p>
            </div>
        </div>

        <div class="bg-muted/30 p-3 rounded-lg">
            <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Total Monthly Budget:</span>
                <span class="text-lg font-semibold">${{ totalAmount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { computed } from "vue"
import type { BudgetAmount, BudgetType } from "../../useRegisterModal"

interface Props {
    availableBudgetTypes: BudgetType[]
    budgetAmounts: BudgetAmount[]
    selectedBudgetTypes: string[]
}

interface Emits {
    (e: 'update-amount', budgetTypeId: string, amount: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getBudgetType = (budgetTypeId: string) => {
    return props.availableBudgetTypes.find(bt => bt.id === budgetTypeId)
}

const getBudgetAmount = (budgetTypeId: string) => {
    const budget = props.budgetAmounts.find(ba => ba.budgetTypeId === budgetTypeId)
    return budget?.amount || 0
}

const handleAmountUpdate = (budgetTypeId: string, event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value === '' ? 0 : parseFloat(target.value)
    emit('update-amount', budgetTypeId, value)
}

const totalAmount = computed(() => {
    return props.budgetAmounts.reduce((total, budget) => total + budget.amount, 0)
})
</script>