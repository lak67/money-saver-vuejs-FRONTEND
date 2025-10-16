<template>
    <div class="space-y-6">
        <div class="text-center space-y-2">
            <div class="text-4xl">✅</div>
            <h3 class="text-lg font-semibold">Confirm Your Information</h3>
            <p class="text-sm text-muted-foreground">
                Review your details before completing registration
            </p>
        </div>

        <!-- Account Information -->
        <div class="space-y-4">
            <div class="bg-muted/50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">Account Details</h4>
                <div class="space-y-1 text-sm">
                    <div><span class="text-muted-foreground">Email:</span> {{ email }}</div>
                    <div><span class="text-muted-foreground">Yearly Income:</span> ${{ yearlyIncome?.toLocaleString() ||
                        '0' }}</div>
                </div>
            </div>

            <!-- Budget Summary -->
            <div class="bg-muted/50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">Monthly Budget Plan</h4>
                <div class="space-y-2">
                    <div v-for="budgetTypeId in selectedBudgetTypes" :key="budgetTypeId"
                        class="flex justify-between items-center text-sm">
                        <div class="flex items-center gap-2">
                            <span>{{ getBudgetType(budgetTypeId)?.icon }}</span>
                            <span>{{ getBudgetType(budgetTypeId)?.name }}</span>
                        </div>
                        <span class="font-medium">${{ getBudgetAmount(budgetTypeId) }}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between items-center font-medium">
                        <span>Total Monthly Budget:</span>
                        <span>${{ totalBudget }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BudgetAmount, BudgetType } from "../../useRegisterModal"

interface Props {
    email: string
    yearlyIncome: number | null
    availableBudgetTypes: BudgetType[]
    budgetAmounts: BudgetAmount[]
    selectedBudgetTypes: string[]
}

const props = defineProps<Props>()

const getBudgetType = (budgetTypeId: string) => {
    return props.availableBudgetTypes.find(bt => bt.id === budgetTypeId)
}

const getBudgetAmount = (budgetTypeId: string) => {
    const budget = props.budgetAmounts.find(ba => ba.budgetTypeId === budgetTypeId)
    return budget?.amount || 0
}

const totalBudget = computed(() => {
    return props.budgetAmounts.reduce((total, budget) => total + budget.amount, 0)
})
</script>