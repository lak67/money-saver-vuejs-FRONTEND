<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types';
import { computed, ref } from 'vue';

interface Props {
    transactions: Transaction[] | null;
    isLoading?: boolean;
}

interface Emits {
    (e: 'edit', transaction: Transaction): void;
    (e: 'delete', transactionId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filterBudgetTypeId = ref<string>('');
const searchQuery = ref<string>('');

const uniqueBudgetTypes = computed(() => {
    const types = new Map<string, { id: string; name: string; icon: string }>();
    if (!Array.isArray(props.transactions)) return [];

    props.transactions.forEach(t => {
        if (!types.has(t.type_name)) {
            types.set(t.type_name, {
                id: t.type_name,
                name: t.type_name,
                icon: t.budget_type_icon || '💰',
            });
        }
    });
    return Array.from(types.values());
});

const filteredTransactions = computed(() => {
    if (!Array.isArray(props.transactions)) return [];

    let filtered = [...props.transactions];

    // Filter by budget type
    if (filterBudgetTypeId.value) {
        filtered = filtered.filter(t => t.type_name === filterBudgetTypeId.value);
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(t =>
            t.type_name.toLowerCase().includes(query) ||
            (t.label_name && t.label_name.toLowerCase().includes(query)) ||
            t.amount.toString().includes(query)
        );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return filtered;
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
};

const clearFilters = () => {
    filterBudgetTypeId.value = '';
    searchQuery.value = '';
};
</script>

<template>
    <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-foreground">Transactions (90 days)</h2>

            <!-- Filters Toggle -->
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="clearFilters" v-if="filterBudgetTypeId || searchQuery">
                    Clear Filters
                </Button>
            </div>
        </div>

        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
            <!-- Budget Type Filter -->
            <select v-model="filterBudgetTypeId"
                class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                :disabled="isLoading">
                <option value="">All Budget Types</option>
                <option v-for="type in uniqueBudgetTypes" :key="type.id" :value="type.id">
                    {{ type.icon }} {{ type.name }}
                </option>
            </select>

            <!-- Search Input -->
            <input v-model="searchQuery" type="text" placeholder="Search transactions..."
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                :disabled="isLoading" />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
            <p class="text-muted-foreground">
                {{ searchQuery || filterBudgetTypeId ? 'No transactions match your filters' : 'No transactions yet' }}
            </p>
        </div>

        <!-- Transaction List -->
        <div v-else class="space-y-2">
            <div v-for="transaction in filteredTransactions" :key="transaction.id"
                class="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors group">
                <div class="flex items-center gap-3 flex-1">
                    <span class="text-2xl">{{ transaction.budget_type_icon }}</span>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-foreground truncate">
                            <template v-if="transaction.label_name">
                                {{ transaction.label_name }}
                                <span class="text-xs font-normal text-muted-foreground ml-1">
                                    {{ transaction.type_name }}
                                </span>
                            </template>
                            <template v-else>
                                {{ transaction.type_name }}
                            </template>
                        </p>
                        <div class="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{{ formatDate(transaction.created_at) }}</span>
                            <!-- <span v-if="transaction.description" class="truncate">• {{ transaction.description }}</span> -->
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="font-semibold text-foreground">
                        ${{ transaction.amount.toFixed(2) }}
                    </span>

                    <!-- Action Buttons (visible on hover) -->
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="emit('edit', transaction)">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Button>
                        <Button variant="ghost" size="sm"
                            class="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            @click="emit('delete', transaction.id)">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
