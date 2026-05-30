<script setup lang="ts">
import type { UserBudgetTypeLabel } from '@/types';

interface Props {
    userBudget: UserBudgetTypeLabel;
}

defineProps<Props>();
</script>

<template>
    <div class="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
            <span class="text-3xl">📊</span>
            <div class="flex-1">
                <h3 class="font-semibold text-foreground text-lg">{{ userBudget.budget_type_with_labels.budget_type }}
                </h3>
                <p class="text-sm text-muted-foreground">{{ userBudget.budget_type_with_labels.description }}</p>
                <p class="text-xs text-muted-foreground mt-1">Total: ${{ userBudget.total_amount.toFixed(2) }}</p>
            </div>
        </div>
    </div>
</template>
