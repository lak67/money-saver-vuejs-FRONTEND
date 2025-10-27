<template>
    <div class="space-y-4">
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Set Your Monthly Budget</h3>
            <p class="text-sm text-muted-foreground">
                Enter the monthly amount for each budget category you selected
            </p>
        </div>

        <div class="space-y-3">
            <div v-for="budgetType in selectedBudgetTypes" :key="budgetType.id" class="space-y-2">
                <div class="flex items-center gap-2">
                    <span>{{ getBudgetType(budgetType.id)?.icon }}</span>
                    <Label :for="String(budgetType.id)">{{ getBudgetType(budgetType.id)?.name }}</Label>
                </div>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input :id="String(budgetType.id)" type="number" :value="budgetType.total_amount"
                        @input="handleAmountUpdate(budgetType.id, $event)" placeholder="0" class="pl-6" min="0"
                        step="10" />
                </div>
                <p class="text-xs text-muted-foreground">
                    {{ getBudgetType(budgetType.id)?.description }}
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
import type { BudgetType, SelectedBudgetType } from "../../useRegisterModal"

interface Props {
    availableBudgetTypes: BudgetType[]
    selectedBudgetTypes: SelectedBudgetType[]
}

interface Emits {
    (e: 'update-amount', budgetTypeId: string, amount: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

console.log('BudgetAmountsView - Available budget types:', props.availableBudgetTypes)
console.log('BudgetAmountsView - Selected budget types:', props.selectedBudgetTypes)

// Create a computed map of budget types for efficient lookups
const budgetTypeMap = computed(() => {
    const map = new Map<string, BudgetType>()
    props.availableBudgetTypes.forEach(bt => {
        map.set(bt.id, bt)
    })
    console.log('Budget type map created:', map)
    return map
})

const getBudgetType = (budgetTypeId: string) => {
    return budgetTypeMap.value.get(budgetTypeId)
}

const handleAmountUpdate = (budgetTypeId: string, event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value === '' ? 0 : parseFloat(target.value)
    emit('update-amount', budgetTypeId, value)
}

const totalAmount = computed(() => {
    return props.selectedBudgetTypes.reduce((total, budget) => total + budget.total_amount, 0)
})
</script>