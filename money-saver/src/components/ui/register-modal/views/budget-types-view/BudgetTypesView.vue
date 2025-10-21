<template>
    <div class="space-y-6 py-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="text-sm text-muted-foreground mt-2">Loading budget categories...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <div class="text-4xl mb-4">⚠️</div>
            <p class="text-sm text-destructive mb-4">{{ error }}</p>
            <button @click="refreshBudgetTypes"
                class="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Try Again
            </button>
        </div>

        <!-- Main Content -->
        <div v-else class="space-y-6">
            <!-- Search and Filter Header -->
            <div class="space-y-4">
                <div class="relative">
                    <Input v-model="searchTerm" placeholder="Search budget categories..." class="pl-10" />
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        🔍
                    </span>
                    <button v-if="searchTerm" @click="clearSearch"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        ✕
                    </button>
                </div>

                <!-- Selection Summary -->
                <div class="flex items-center justify-between">
                    <p class="text-sm text-muted-foreground">
                        {{ getSelectionSummary(selectedBudgetTypes) }}
                    </p>
                    <div class="">
                        <!-- <button @click="handleSelectRecommended"
                            class="text-xs px-3 py-1 bg-primary/10 text-white rounded-full hover:bg-primary/20 transition-colors">
                            Select Recommended
                        </button> -->
                        <button v-if="selectedBudgetTypes.length > 0" @click="handleClearAll"
                            class="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            <!-- Recommended Section -->
            <div v-if="!searchTerm && showRecommended">
                <h4 class="text-sm font-medium mb-3 flex items-center gap-2">
                    <span>⭐</span>
                    Recommended for Starters
                </h4>
                <div class="grid grid-cols-1 gap-3">
                    <BudgetTypeCard v-for="budgetType in getRecommendedTypes" :key="budgetType.id"
                        :budget-type="budgetType" :is-selected="selectedBudgetTypes.includes(budgetType.id)"
                        @toggle="$emit('toggle', budgetType.id)" />
                </div>
            </div>

            <!-- Other Categories Section -->
            <div v-if="!searchTerm && showRecommended">
                <h4 class="text-sm font-medium mb-3 flex items-center gap-2">
                    <span>📋</span>
                    Other Categories
                </h4>
                <div class="grid grid-cols-1 gap-3">
                    <BudgetTypeCard v-for="budgetType in getOtherTypes" :key="budgetType.id" :budget-type="budgetType"
                        :is-selected="selectedBudgetTypes.includes(budgetType.id)"
                        @toggle="$emit('toggle', budgetType.id)" />
                </div>
            </div>

            <!-- Search Results -->
            <div v-if="searchTerm">
                <h4 class="text-sm font-medium mb-3">
                    Search Results
                </h4>
                <div class="grid grid-cols-1 gap-3">
                    <BudgetTypeCard v-for="budgetType in filteredBudgetTypes" :key="budgetType.id"
                        :budget-type="budgetType" :is-selected="selectedBudgetTypes.includes(budgetType.id)"
                        @toggle="$emit('toggle', budgetType.id)" />
                </div>
                <p v-if="filteredBudgetTypes.length === 0" class="text-center text-muted-foreground py-8">
                    No categories found matching "{{ searchTerm }}"
                </p>
            </div>

            <!-- Selection Help Text -->
            <div class="bg-muted/50 p-4 rounded-lg">
                <p class="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Select the budget categories that apply to your monthly expenses.
                    You'll set specific amounts for each category in the next step.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input"
import type { BudgetType } from "../../useRegisterModal"
import BudgetTypeCard from "./BudgetTypeCard.vue"
import { useBudgetTypesView } from "./useBudgetTypesView"

interface Props {
    availableBudgetTypes: BudgetType[]
    selectedBudgetTypes: string[]
}

interface Emits {
    toggle: [budgetTypeId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use the composable
const {
    searchTerm,
    showRecommended,
    isLoading,
    error,
    filteredBudgetTypes,
    getRecommendedTypes,
    getOtherTypes,
    getSelectionSummary,
    clearSearch,
    clearAll,
    refreshBudgetTypes
} = useBudgetTypesView()

// Event handlers  
// const handleSelectRecommended = () => {
//     selectRecommended((id: string) => emit('toggle', id), props.selectedBudgetTypes)
// }

const handleClearAll = () => {
    clearAll(props.selectedBudgetTypes, (id: string) => emit('toggle', id))
}

// Expose validation for parent
defineExpose({
    validateForm: () => props.selectedBudgetTypes.length > 0
})
</script>