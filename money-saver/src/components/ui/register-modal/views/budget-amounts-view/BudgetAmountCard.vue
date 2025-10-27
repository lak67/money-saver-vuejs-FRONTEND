<template>
    <div class="border rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="text-2xl">{{ budgetType.icon }}</div>
                <div>
                    <h5 class="font-medium text-sm">{{ budgetType.name }}</h5>
                    <p class="text-xs text-muted-foreground">{{ budgetType.description }}</p>
                </div>
            </div>
        </div>

        <div class="flex gap-3 items-end">
            <div class="flex-1">
                <div class="relative mt-1">
                    <Input :id="`amount-${budget.budgetTypeId}`"
                        :model-value="showPercentage ? getPercentageValue : budget.total_amount"
                        @update:model-value="handleAmountUpdate" type="number" step="0.01" min="0"
                        :class="showPercentage ? 'pr-8' : 'pl-8'" :placeholder="showPercentage ? '0' : '0.00'" />
                </div>
            </div>

            <div v-if="totalIncome && parseFloat(totalIncome) > 0" class="text-right min-w-0">
                <div class="text-xs text-muted-foreground">
                    {{ showPercentage ? 'Amount' : 'Percentage' }}
                </div>
                <div class="text-sm font-medium">
                    {{ showPercentage ? formatCurrency(getAmountFromPercentage) : `${getCurrentPercentage}%` }}
                </div>
            </div>
        </div>

        <!-- Quick amount buttons -->
        <div v-if="recommendedPercentage && totalIncome && parseFloat(totalIncome) > 0" class="flex gap-2">
            <button @click="applyRecommended"
                class="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                Use {{ recommendedPercentage }}%
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { computed } from 'vue'
import type { BudgetAmount, BudgetType } from "../../useRegisterModal"

interface Props {
    budget: BudgetAmount
    budgetType: BudgetType
    totalIncome: string
    showPercentage: boolean
    recommendedPercentage?: number
}

interface Emits {
    updateAmount: [amount: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed properties
const formatCurrency = computed(() => (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '$0.00'

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(numAmount)
})

const getCurrentPercentage = computed(() => {
    const amount = parseInt(String(props.budget.total_amount)) || 0
    const income = parseInt(props.totalIncome) || 0

    if (income === 0) return 0
    return Math.round((amount / income) * 100)
})

const getPercentageValue = computed(() => {
    return getCurrentPercentage.value.toString()
})

const getAmountFromPercentage = computed(() => {
    const percentage = getCurrentPercentage.value
    const income = parseFloat(props.totalIncome) || 0
    return (income * percentage) / 100
})

// Event handlers
const handleAmountUpdate = (value: string | number) => {
    const stringValue = String(value)

    if (props.showPercentage) {
        // Convert percentage to amount
        const percentage = parseFloat(stringValue) || 0
        const income = parseFloat(props.totalIncome) || 0
        const amount = (income * percentage) / 100
        emit('updateAmount', amount.toFixed(2))
    } else {
        emit('updateAmount', stringValue)
    }
}

const applyRecommended = () => {
    if (props.recommendedPercentage && props.totalIncome) {
        const income = parseFloat(props.totalIncome) || 0
        const amount = (income * props.recommendedPercentage) / 100
        emit('updateAmount', amount.toFixed(2))
    }
}
</script>