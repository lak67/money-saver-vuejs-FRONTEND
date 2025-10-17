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
                            <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select class="w-full md:w-auto border border-gray-300 rounded-md px-3 py-2">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>CAD (C$)</option>
                            </select>
                        </div>
                        <div class="pt-4">
                            <button
                                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Budget Categories -->
                <div class="bg-white rounded-lg shadow-sm">
                    <div class="p-6 border-b">
                        <h2 class="text-lg font-semibold">Budget Categories</h2>
                        <p class="text-sm text-gray-600">Customize your budget categories</p>
                    </div>
                    <div class="p-6">
                        <div class="space-y-3 mb-4">
                            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                <div class="flex items-center">
                                    <span class="text-xl mr-3">🏠</span>
                                    <span class="font-medium">Rent</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                    <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                <div class="flex items-center">
                                    <span class="text-xl mr-3">🍽️</span>
                                    <span class="font-medium">Food</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                    <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                <div class="flex items-center">
                                    <span class="text-xl mr-3">⚡</span>
                                    <span class="font-medium">Utilities</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                    <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                        <button
                            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                            + Add New Category
                        </button>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="bg-white rounded-lg shadow-sm">
                    <div class="p-6 border-b">
                        <h2 class="text-lg font-semibold">Notifications</h2>
                        <p class="text-sm text-gray-600">Choose what notifications you want to receive</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium">Budget Limit Alerts</p>
                                <p class="text-sm text-gray-600">Get notified when you're close to your budget limits
                                </p>
                            </div>
                            <input type="checkbox" checked class="h-4 w-4 text-blue-600 rounded">
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium">Monthly Reports</p>
                                <p class="text-sm text-gray-600">Receive monthly spending summaries</p>
                            </div>
                            <input type="checkbox" checked class="h-4 w-4 text-blue-600 rounded">
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium">Large Expense Alerts</p>
                                <p class="text-sm text-gray-600">Get notified for expenses over $100</p>
                            </div>
                            <input type="checkbox" class="h-4 w-4 text-blue-600 rounded">
                        </div>
                        <div class="pt-4">
                            <button
                                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Security -->
                <div class="bg-white rounded-lg shadow-sm">
                    <div class="p-6 border-b">
                        <h2 class="text-lg font-semibold">Security</h2>
                        <p class="text-sm text-gray-600">Manage your account security</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div>
                            <button
                                class="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                                Change Password
                            </button>
                        </div>
                        <div>
                            <button
                                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                                Delete Account
                            </button>
                            <p class="text-sm text-gray-600 mt-2">This action cannot be undone. All your data will be
                                permanently deleted.</p>
                        </div>
                    </div>
                </div>

                <!-- Export Data -->
                <div class="bg-white rounded-lg shadow-sm">
                    <div class="p-6 border-b">
                        <h2 class="text-lg font-semibold">Data Export</h2>
                        <p class="text-sm text-gray-600">Download your financial data</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex flex-wrap gap-4">
                            <button
                                class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                Export as CSV
                            </button>
                            <button
                                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Export as PDF
                            </button>
                            <button
                                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
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
// Settings logic will go here
</script>