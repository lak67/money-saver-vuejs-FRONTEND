<template>
    <div class="min-h-screen bg-background">
        <!-- Expenses Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-foreground mb-2">Expenses</h1>
                    <p class="text-muted-foreground">Track and manage your spending</p>
                </div>
                <button
                    class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    + Add Expense
                </button>
            </div>

            <!-- Filters -->
            <div class="bg-card border border-border p-4 rounded-lg shadow-sm mb-6">
                <div class="flex flex-wrap gap-4">
                    <select class="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm">
                        <option>All Categories</option>
                        <option>🏠 Rent</option>
                        <option>🍽️ Food</option>
                        <option>⚡ Utilities</option>
                        <option>🚗 Transportation</option>
                        <option>🛡️ Insurance</option>
                    </select>
                    <select class="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm">
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                    <input type="text" placeholder="Search expenses..."
                        class="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground">
                </div>
            </div>

            <!-- Expenses List -->
            <div class="bg-card border border-border rounded-lg shadow-sm">
                <div class="p-6 border-b border-border">
                    <h2 class="text-lg font-semibold text-card-foreground">Recent Expenses</h2>
                </div>

                <div class="divide-y divide-border">
                    <div class="p-6 flex justify-between items-center hover:bg-accent transition-colors">
                        <div class="flex items-center">
                            <span class="text-2xl mr-4">🍽️</span>
                            <div>
                                <h3 class="font-medium text-card-foreground">Whole Foods Market</h3>
                                <p class="text-sm text-muted-foreground">October 15, 2025 • Food & Dining</p>
                                <p class="text-sm text-muted-foreground">Weekly grocery shopping</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-lg text-red-600 dark:text-red-400">-$125.50</p>
                            <button class="text-sm text-primary hover:text-primary/80">Edit</button>
                        </div>
                    </div>

                    <div class="p-6 flex justify-between items-center hover:bg-accent transition-colors">
                        <div class="flex items-center">
                            <span class="text-2xl mr-4">⚡</span>
                            <div>
                                <h3 class="font-medium text-card-foreground">Pacific Gas & Electric</h3>
                                <p class="text-sm text-muted-foreground">October 14, 2025 • Utilities</p>
                                <p class="text-sm text-muted-foreground">Monthly electricity bill</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-lg text-red-600 dark:text-red-400">-$87.25</p>
                            <button class="text-sm text-primary hover:text-primary/80">Edit</button>
                        </div>
                    </div>

                    <div class="p-6 flex justify-between items-center hover:bg-accent transition-colors">
                        <div class="flex items-center">
                            <span class="text-2xl mr-4">🚗</span>
                            <div>
                                <h3 class="font-medium text-card-foreground">Shell Gas Station</h3>
                                <p class="text-sm text-muted-foreground">October 13, 2025 • Transportation</p>
                                <p class="text-sm text-muted-foreground">Fuel for commute</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-lg text-red-600 dark:text-red-400">-$45.00</p>
                            <button class="text-sm text-primary hover:text-primary/80">Edit</button>
                        </div>
                    </div>

                    <div class="p-6 flex justify-between items-center hover:bg-accent transition-colors">
                        <div class="flex items-center">
                            <span class="text-2xl mr-4">🏠</span>
                            <div>
                                <h3 class="font-medium text-card-foreground">Monthly Rent</h3>
                                <p class="text-sm text-muted-foreground">October 1, 2025 • Housing</p>
                                <p class="text-sm text-muted-foreground">Apartment rent payment</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-lg text-red-600 dark:text-red-400">-$1,200.00</p>
                            <button class="text-sm text-primary hover:text-primary/80">Edit</button>
                        </div>
                    </div>

                    <div class="p-6 flex justify-between items-center hover:bg-accent transition-colors">
                        <div class="flex items-center">
                            <span class="text-2xl mr-4">🛡️</span>
                            <div>
                                <h3 class="font-medium text-card-foreground">Health Insurance</h3>
                                <p class="text-sm text-muted-foreground">October 1, 2025 • Insurance</p>
                                <p class="text-sm text-muted-foreground">Monthly premium</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-lg text-red-600 dark:text-red-400">-$320.00</p>
                            <button class="text-sm text-primary hover:text-primary/80">Edit</button>
                        </div>
                    </div>
                </div>

                <!-- Load More -->
                <div class="p-6 text-center border-t border-border">
                    <button class="text-primary hover:text-primary/80 font-medium">Load More Expenses</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Future: Expenses logic will go here
</script>