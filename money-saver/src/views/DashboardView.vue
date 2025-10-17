<template>
    <div class="min-h-screen bg-background">
        <!-- Dashboard Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                <p class="text-muted-foreground">Overview of your financial health</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="text-2xl mr-3">💰</div>
                        <div>
                            <p class="text-sm text-muted-foreground">Total Balance</p>
                            <p class="text-2xl font-bold text-green-600 dark:text-green-400">$5,420.50</p>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="text-2xl mr-3">📊</div>
                        <div>
                            <p class="text-sm text-muted-foreground">This Month</p>
                            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">$2,150.00</p>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="text-2xl mr-3">💸</div>
                        <div>
                            <p class="text-sm text-muted-foreground">Expenses</p>
                            <p class="text-2xl font-bold text-red-600 dark:text-red-400">$1,890.25</p>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="text-2xl mr-3">🎯</div>
                        <div>
                            <p class="text-sm text-muted-foreground">Budget Left</p>
                            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">$259.75</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h2 class="text-lg font-semibold text-card-foreground mb-4">Recent Expenses</h2>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-border">
                            <div class="flex items-center">
                                <span class="text-lg mr-3">🍽️</span>
                                <div>
                                    <p class="font-medium text-card-foreground">Grocery Store</p>
                                    <p class="text-sm text-muted-foreground">Food & Dining</p>
                                </div>
                            </div>
                            <span class="font-semibold text-red-600 dark:text-red-400">-$85.50</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-border">
                            <div class="flex items-center">
                                <span class="text-lg mr-3">⚡</span>
                                <div>
                                    <p class="font-medium text-card-foreground">Electric Bill</p>
                                    <p class="text-sm text-muted-foreground">Utilities</p>
                                </div>
                            </div>
                            <span class="font-semibold text-red-600 dark:text-red-400">-$120.00</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-border">
                            <div class="flex items-center">
                                <span class="text-lg mr-3">🚗</span>
                                <div>
                                    <p class="font-medium text-card-foreground">Gas Station</p>
                                    <p class="text-sm text-muted-foreground">Transportation</p>
                                </div>
                            </div>
                            <span class="font-semibold text-red-600 dark:text-red-400">-$45.00</span>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h2 class="text-lg font-semibold text-card-foreground mb-4">Budget Overview</h2>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm font-medium text-card-foreground">🏠 Rent</span>
                                <span class="text-sm text-muted-foreground">$1200 / $1200</span>
                            </div>
                            <div class="w-full bg-muted rounded-full h-2">
                                <div class="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" style="width: 100%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm font-medium text-card-foreground">🍽️ Food</span>
                                <span class="text-sm text-muted-foreground">$320 / $400</span>
                            </div>
                            <div class="w-full bg-muted rounded-full h-2">
                                <div class="bg-green-600 dark:bg-green-400 h-2 rounded-full" style="width: 80%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm font-medium text-card-foreground">⚡ Utilities</span>
                                <span class="text-sm text-muted-foreground">$180 / $200</span>
                            </div>
                            <div class="w-full bg-muted rounded-full h-2">
                                <div class="bg-yellow-600 dark:bg-yellow-400 h-2 rounded-full" style="width: 90%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm font-medium text-card-foreground">🚗 Transportation</span>
                                <span class="text-sm text-muted-foreground">$150 / $300</span>
                            </div>
                            <div class="w-full bg-muted rounded-full h-2">
                                <div class="bg-green-600 dark:bg-green-400 h-2 rounded-full" style="width: 50%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Dashboard logic will go here
</script>