<script setup lang="ts">
import type { UserBudget } from '@/services/budget/BudgetServices';
import { computed } from 'vue';

interface Props {
    budget: UserBudget;
}

const props = defineProps<Props>();

const percentageUsed = computed(() => {
    if (props.budget.weekly_amount === 0) return 0;
    return Math.min((props.budget.spent_this_week / props.budget.weekly_amount) * 100, 100);
});

const remaining = computed(() => {
    return Math.max(props.budget.weekly_amount - props.budget.spent_this_week, 0);
});

const statusColor = computed(() => {
    const percentage = percentageUsed.value;
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
});

const progressBarColor = computed(() => {
    const percentage = percentageUsed.value;
    if (percentage >= 90) return 'bg-red-500 dark:bg-red-400';
    if (percentage >= 70) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-green-500 dark:bg-green-400';
});
</script>

<template>
    <div class="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
                <span class="text-2xl">{{ budget.budget_type_icon }}</span>
                <div>
                    <h3 class="font-semibold text-foreground">{{ budget.budget_type_name }}</h3>
                    <p class="text-xs text-muted-foreground">Weekly Budget</p>
                </div>
            </div>
            <div class="text-right">
                <p :class="statusColor" class="font-bold text-lg">
                    ${{ budget.spent_this_week.toFixed(2) }}
                </p>
                <p class="text-xs text-muted-foreground">
                    of ${{ budget.weekly_amount.toFixed(2) }}
                </p>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-muted rounded-full h-2 mb-2">
            <div :class="progressBarColor" class="h-2 rounded-full transition-all duration-300"
                :style="{ width: `${percentageUsed}%` }" />
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">
                {{ percentageUsed.toFixed(0) }}% used
            </span>
            <span class="text-muted-foreground">
                ${{ remaining.toFixed(2) }} remaining
            </span>
        </div>
    </div>
</template>
