<template>
    <div @click="$emit('toggle')" :class="`
      p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
      ${isSelected
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-muted hover:border-primary/50 hover:bg-muted/50'
        }
    `">
        <div class="flex items-start justify-between">
            <div class="flex items-start gap-3 flex-1">
                <div class="text-2xl">{{ budgetType.icon }}</div>
                <div class="flex-1 min-w-0">
                    <h5 class="font-medium text-sm">{{ budgetType.name }}</h5>
                    <p class="text-xs text-muted-foreground mt-1">{{ budgetType.description }}</p>
                </div>
            </div>
            <div :class="`
          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${isSelected
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                }
        `">
                <div v-if="isSelected" class="w-2 h-2 bg-white rounded-full"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BudgetType } from "../../useRegisterModal";

interface Props {
    budgetType: BudgetType
    isSelected: boolean
}

interface Emits {
    toggle: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>