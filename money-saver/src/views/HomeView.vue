<script setup lang="ts">
import { useAuth } from '@/features/auth';
import { BudgetCard, BudgetServices } from '@/features/budget';
import { AddTransactionForm, TransactionList, TransactionServices } from '@/features/transactions';
import type { CreateTransactionPayload, Transaction, UserBudget } from '@/types';
import { onMounted, ref, watch } from 'vue';

const { isAuthenticated } = useAuth();

// State
const budgets = ref<UserBudget | null>(null);
const transactions = ref<Transaction[]>([]);
const isLoadingBudgets = ref(false);
const isLoadingTransactions = ref(false);

// Services
const budgetService = BudgetServices;
const transactionService = TransactionServices;

// Fetch data
const fetchBudgets = async () => {
    isLoadingBudgets.value = true;
    try {
        budgets.value = await budgetService.fetchUserBudgets();
        console.log("Fetched budgets:", budgets.value);
    } catch (error) {
        console.error('Failed to fetch budgets:', error);
    } finally {
        isLoadingBudgets.value = false;
    }
};

const fetchTransactions = async () => {
    isLoadingTransactions.value = true;
    try {
        // Fetch last 90 days of transactions
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);

        const data = await transactionService.fetchTransactions({
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        });
        
        // Ensure data is an array
        transactions.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        transactions.value = []; // Reset to empty array on error
    } finally {
        isLoadingTransactions.value = false;
    }
};

// Handle transaction success (after submission)
const onTransactionSuccess = async () => {
    // Refresh both budgets and transactions
    await Promise.all([fetchBudgets(), fetchTransactions()]);
};

// Handle transaction edit
const handleEditTransaction = async (transaction: Transaction) => {
    // TODO: Implement edit modal/form
    console.log('Edit transaction:', transaction);
};

// Handle transaction delete
const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
        await transactionService.deleteTransaction(transactionId);

        // Refresh both budgets and transactions
        await Promise.all([fetchBudgets(), fetchTransactions()]);
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        // TODO: Show error message to user
    }
};

// Initialize data when user is authenticated
const initDashboard = async () => {
    await Promise.all([
        fetchBudgets(),
        fetchTransactions()
    ]);
    console.log("Dashboard initialized with budgets:", budgets.value);
};

// Run immediately if already authenticated on mount,
// and also watch for auth state change (e.g. after login via modal)
onMounted(() => {
    if (isAuthenticated.value) {
        initDashboard();
    }
});

watch(isAuthenticated, (authenticated) => {
    if (authenticated) {
        initDashboard();
    }
});
</script>

<template>
    <!-- Authenticated View -->
    <div v-if="isAuthenticated" class="min-h-screen bg-background">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Weekly Budget Cards -->
            <section class="mb-8">
                <h2 class="text-2xl font-bold text-foreground mb-4">Weekly Budgets</h2>

                <div v-if="isLoadingBudgets" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>

                <div v-else-if="!budgets || !budgets.labels || !budgets.labels.users_budget_type_labels || budgets.labels.users_budget_type_labels.length === 0"
                    class="text-center py-12 bg-card border border-border rounded-lg">
                    <p class="text-muted-foreground">No budgets configured yet.</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <BudgetCard v-for="userBudget in budgets.labels.users_budget_type_labels" :key="userBudget.id"
                        :user-budget="userBudget" />
                </div>
            </section>

            <!-- Add Transaction Form -->
            <section class="mb-8">
                <AddTransactionForm :budgets="budgets" @success="onTransactionSuccess" />
            </section>

            <!-- Transactions List -->
            <section>
                <TransactionList :transactions="transactions" :is-loading="isLoadingTransactions"
                    @edit="handleEditTransaction" @delete="handleDeleteTransaction" />
            </section>
        </div>
    </div>

    <!-- Landing Page (Not Authenticated) -->
    <div v-else class="min-h-screen bg-gradient-to-br from-background to-muted">
        <!-- Hero Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
                <div class="text-6xl mb-6">💰</div>
                <h2 class="text-4xl font-bold text-foreground mb-4">Welcome to Money Saver</h2>
                <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Take control of your finances with our comprehensive budgeting and expense tracking tools.
                    Start your journey to financial freedom today!
                </p>

                <!-- Feature Cards -->
                <div class="grid md:grid-cols-3 gap-8 mt-12">
                    <div
                        class="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="text-3xl mb-4">📊</div>
                        <h3 class="text-lg font-semibold mb-2 text-card-foreground">Track Expenses</h3>
                        <p class="text-muted-foreground">Monitor your spending across different categories and see where
                            your
                            money goes.</p>
                    </div>

                    <div
                        class="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="text-3xl mb-4">🎯</div>
                        <h3 class="text-lg font-semibold mb-2 text-card-foreground">Budget Planning</h3>
                        <p class="text-muted-foreground">Set monthly budgets for different categories and stay on track
                            with
                            your financial goals.</p>
                    </div>

                    <div
                        class="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="text-3xl mb-4">📈</div>
                        <h3 class="text-lg font-semibold mb-2 text-card-foreground">Financial Insights</h3>
                        <p class="text-muted-foreground">Get detailed reports and insights about your spending patterns
                            and
                            savings progress.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>