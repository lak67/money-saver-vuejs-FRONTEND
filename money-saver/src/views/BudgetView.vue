<template>
    <div class="min-h-screen bg-background">
        <!-- Budget Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-foreground mb-2">Budget Management</h1>
                    <p class="text-muted-foreground">Set and track your monthly budgets</p>
                </div>
                <button
                    class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    + Add Category
                </button>
            </div>

            <!-- Budget Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="text-center">
                        <div class="text-2xl mb-2">💰</div>
                        <p class="text-sm text-muted-foreground">Total Budget</p>
                        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">$3,200.00</p>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="text-center">
                        <div class="text-2xl mb-2">💸</div>
                        <p class="text-sm text-muted-foreground">Total Spent</p>
                        <p class="text-2xl font-bold text-red-600 dark:text-red-400">$2,440.25</p>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div class="text-center">
                        <div class="text-2xl mb-2">💵</div>
                        <p class="text-sm text-muted-foreground">Remaining</p>
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400">$759.75</p>
                    </div>
                </div>
            </div>

            <!-- Budget Categories -->
            <div class="bg-card border border-border rounded-lg shadow-sm">
                <div class="p-6 border-b border-border">
                    <h2 class="text-lg font-semibold text-card-foreground">Budget Categories</h2>
                </div>

                <div class="p-6 space-y-6">
                    <!-- Rent -->
                    <div class="border border-border rounded-lg p-4">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🏠</span>
                                <div>
                                    <h3 class="font-medium text-card-foreground">Rent</h3>
                                    <p class="text-sm text-muted-foreground">Housing & Accommodation</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-card-foreground">$1,200.00 / $1,200.00</p>
                                <p class="text-sm text-red-600 dark:text-red-400">100% used</p>
                            </div>
                        </div>
                        <div class="w-full bg-muted rounded-full h-3">
                            <div class="bg-red-500 dark:bg-red-600 h-3 rounded-full" style="width: 100%"></div>
                        </div>
                    </div>

                    <!-- Food -->
                    <div class="border border-border rounded-lg p-4">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🍽️</span>
                                <div>
                                    <h3 class="font-medium text-card-foreground">Food</h3>
                                    <p class="text-sm text-muted-foreground">Groceries & Dining</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-card-foreground">$320.50 / $500.00</p>
                                <p class="text-sm text-green-600 dark:text-green-400">64% used</p>
                            </div>
                        </div>
                        <div class="w-full bg-muted rounded-full h-3">
                            <div class="bg-green-500 dark:bg-green-600 h-3 rounded-full" style="width: 64%"></div>
                        </div>
                    </div>

                    <!-- Utilities -->
                    <div class="border border-border rounded-lg p-4">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">⚡</span>
                                <div>
                                    <h3 class="font-medium text-card-foreground">Utilities</h3>
                                    <p class="text-sm text-muted-foreground">Electric, Water, Gas, Internet</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-card-foreground">$275.25 / $300.00</p>
                                <p class="text-sm text-yellow-600 dark:text-yellow-400">92% used</p>
                            </div>
                        </div>
                        <div class="w-full bg-muted rounded-full h-3">
                            <div class="bg-yellow-500 dark:bg-yellow-600 h-3 rounded-full" style="width: 92%"></div>
                        </div>
                    </div>

                    <!-- Transportation -->
                    <div class="border border-border rounded-lg p-4">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🚗</span>
                                <div>
                                    <h3 class="font-medium text-card-foreground">Transportation</h3>
                                    <p class="text-sm text-muted-foreground">Car payments, Gas, Public transit</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-card-foreground">$324.50 / $400.00</p>
                                <p class="text-sm text-green-600 dark:text-green-400">81% used</p>
                            </div>
                        </div>
                        <div class="w-full bg-muted rounded-full h-3">
                            <div class="bg-green-500 dark:bg-green-600 h-3 rounded-full" style="width: 81%"></div>
                        </div>
                    </div>

                    <!-- Insurance -->
                    <div class="border border-border rounded-lg p-4">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🛡️</span>
                                <div>
                                    <h3 class="font-medium text-card-foreground">Insurance</h3>
                                    <p class="text-sm text-muted-foreground">Health, Auto, Life insurance</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-card-foreground">$320.00 / $800.00</p>
                                <p class="text-sm text-green-600 dark:text-green-400">40% used</p>
                            </div>
                        </div>
                        <div class="w-full bg-muted rounded-full h-3">
                            <div class="bg-green-500 dark:bg-green-600 h-3 rounded-full" style="width: 40%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Budget Insights -->
            <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h3 class="text-lg font-semibold text-card-foreground mb-4">Monthly Trends</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">September 2025</span>
                            <span class="font-medium text-card-foreground">$2,890.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">August 2025</span>
                            <span class="font-medium text-card-foreground">$3,120.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">July 2025</span>
                            <span class="font-medium text-card-foreground">$2,675.00</span>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h3 class="text-lg font-semibold text-card-foreground mb-4">Budget Tips</h3>
                    <div class="space-y-3 text-sm text-muted-foreground">
                        <div class="flex items-start">
                            <span class="text-green-500 dark:text-green-400 mr-2">✓</span>
                            <span>You're doing great with your Food budget! Consider reallocating some funds to
                                savings.</span>
                        </div>
                        <div class="flex items-start">
                            <span class="text-yellow-500 dark:text-yellow-400 mr-2">⚠</span>
                            <span>Your Utilities spending is close to the limit. Consider energy-saving measures.</span>
                        </div>
                        <div class="flex items-start">
                            <span class="text-red-500 dark:text-red-400 mr-2">!</span>
                            <span>Rent is at 100%. This is normal for fixed expenses, but ensure other categories stay
                                flexible.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Budget logic will go here
</script>