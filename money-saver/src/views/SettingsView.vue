<template>
    <div class="min-h-screen bg-background">
        <!-- Settings Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-foreground mb-2">Settings</h1>
                <p class="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <!-- Settings Sections -->
            <div class="space-y-8">
                <!-- Theme Settings -->
                <div class="bg-card border border-border rounded-lg shadow-sm">
                    <div class="p-6 border-b border-border">
                        <h2 class="text-lg font-semibold text-card-foreground">Appearance</h2>
                        <p class="text-sm text-muted-foreground mt-1">Customize the look and feel of your application
                        </p>
                    </div>
                    <div class="p-6">
                        <ThemeSelector />
                    </div>
                </div>

                <!-- Profile Settings -->
                <div class="bg-card border border-border rounded-lg shadow-sm">
                    <div class="p-6 border-b border-border">
                        <h2 class="text-lg font-semibold text-card-foreground">Profile Information</h2>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-foreground mb-2">Email Address</label>
                                <input type="email" value="user@example.com"
                                    class="w-full border border-input bg-background rounded-md px-3 py-2 text-foreground">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-foreground mb-2">Yearly Income</label>
                                <input type="number" value="75000"
                                    class="w-full border border-input bg-background rounded-md px-3 py-2 text-foreground">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-2">Currency</label>
                            <select class="w-full md:w-auto border border-input bg-background text-foreground rounded-md px-3 py-2">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>CAD (C$)</option>
                            </select>
                        </div>
                        <div class="pt-4">
                            <button
                                class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Budget Categories -->
                <div class="bg-card border border-border rounded-lg shadow-sm">
                    <div class="p-6 border-b border-border">
                        <h2 class="text-lg font-semibold text-card-foreground">Budget Categories</h2>
                        <p class="text-sm text-muted-foreground">Customize your budget categories</p>
                    </div>
                    <div class="p-6">
                        <div class="space-y-3 mb-4">
                            <div class="flex justify-between items-center p-3 border border-border rounded-lg">
                                <div class="flex items-center">
                                    <span class="text-xl mr-3">🏠</span>
                                    <span class="font-medium text-card-foreground">Rent</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-primary hover:text-primary/80 text-sm">Edit</button>
                                    <button class="text-red-600 dark:text-red-400 hover:opacity-80 text-sm">Delete</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-3 border border-border rounded-lg">
                                <div class="flex items-center">
                                    <span class="text-xl mr-3">🍽️</span>
                                    <span class="font-medium text-card-foreground">Food</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-primary hover:text-primary/80 text-sm">Edit</button>
                                    <button class="text-red-600 dark:text-red-400 hover:opacity-80 text-sm">Delete</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-3 border border-border rounded-lg">
                                <div class="flex items-center">
                                    <span class="text-xl mr-3">⚡</span>
                                    <span class="font-medium text-card-foreground">Utilities</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-primary hover:text-primary/80 text-sm">Edit</button>
                                    <button class="text-red-600 dark:text-red-400 hover:opacity-80 text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                        <button
                            class="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors">
                            + Add New Category
                        </button>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="bg-card border border-border rounded-lg shadow-sm">
                    <div class="p-6 border-b border-border">
                        <h2 class="text-lg font-semibold text-card-foreground">Notifications</h2>
                        <p class="text-sm text-muted-foreground">Choose what notifications you want to receive</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium text-card-foreground">Budget Limit Alerts</p>
                                <p class="text-sm text-muted-foreground">Get notified when you're close to your budget limits
                                </p>
                            </div>
                            <input type="checkbox" checked class="h-4 w-4 text-primary rounded accent-primary">
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium text-card-foreground">Monthly Reports</p>
                                <p class="text-sm text-muted-foreground">Receive monthly spending summaries</p>
                            </div>
                            <input type="checkbox" checked class="h-4 w-4 text-primary rounded accent-primary">
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium text-card-foreground">Large Expense Alerts</p>
                                <p class="text-sm text-muted-foreground">Get notified for expenses over $100</p>
                            </div>
                            <input type="checkbox" class="h-4 w-4 text-primary rounded accent-primary">
                        </div>
                        <div class="pt-4">
                            <button
                                class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Security -->
                <div class="bg-card border border-border rounded-lg shadow-sm">
                    <div class="p-6 border-b border-border">
                        <h2 class="text-lg font-semibold text-card-foreground">Security</h2>
                        <p class="text-sm text-muted-foreground">Manage your account security</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div>
                            <button
                                class="bg-yellow-600 dark:bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-700 dark:hover:bg-yellow-800 transition-colors">
                                Change Password
                            </button>
                        </div>
                        <div>
                            <button
                                class="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors">
                                Delete Account
                            </button>
                            <p class="text-sm text-muted-foreground mt-2">This action cannot be undone. All your data will be
                                permanently deleted.</p>
                        </div>
                    </div>
                </div>

                <!-- Export Data -->
                <div class="bg-card border border-border rounded-lg shadow-sm">
                    <div class="p-6 border-b border-border">
                        <h2 class="text-lg font-semibold text-card-foreground">Data Export</h2>
                        <p class="text-sm text-muted-foreground">Download your financial data</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex flex-wrap gap-4">
                            <button
                                class="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors">
                                Export as CSV
                            </button>
                            <button
                                class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                                Export as PDF
                            </button>
                            <button
                                class="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors">
                                Export as JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ThemeSelector } from '@/components/ui/theme-toggle';

// Future: Settings logic will go here
</script>