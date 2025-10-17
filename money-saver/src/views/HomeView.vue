<template>
    <div class="min-h-screen bg-gradient-to-br from-background to-muted">
        <!-- Hero Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
                <div class="text-6xl mb-6">💰</div>
                <h2 class="text-4xl font-bold text-foreground mb-4">Welcome to Money Saver</h2>
                <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Take control of your finances with our comprehensive budgeting and expense tracking tools.
                    Start your journey to financial freedom today!
                </p>

                <!-- Registration Modal Trigger -->
                <div class="mb-8">
                    <RegisterModal />
                </div>

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

<script setup lang="ts">
import RegisterModal from '@/components/ui/register-modal/RegisterModal.vue';
</script>