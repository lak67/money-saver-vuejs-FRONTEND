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
                        <p class="text-sm text-muted-foreground mt-1">Update your personal information and income details</p>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                                <Label for="email" class="mb-2">Email Address</Label>
                                <div class="flex gap-2">
                                    <Input id="email" type="email" :model-value="user?.email" disabled class="bg-muted/50 cursor-not-allowed flex-1" />
                                    <SecurityActionModal type="email">
                                        <Button variant="outline">Change</Button>
                                    </SecurityActionModal>
                                </div>
                            </div>
                            <div>
                                <Label for="firstName" class="mb-2">First Name</Label>
                                <Input id="firstName" v-model="formData.first_name" placeholder="Enter first name" />
                            </div>
                            <div>
                                <Label for="lastName" class="mb-2">Last Name</Label>
                                <Input id="lastName" v-model="formData.last_name" placeholder="Enter last name" />
                            </div>
                            <div>
                                <Label for="income" class="mb-2">Yearly Income</Label>
                                <Input id="income" type="number" 
                                    :model-value="formData.income ?? ''" 
                                    @update:model-value="val => formData.income = val === '' ? null : Number(val)"
                                    placeholder="e.g. 75000" />
                            </div>
                        </div>
                        
                        <div class="pt-4 flex items-center gap-3">
                            <Button @click="handleSave" :disabled="!hasChanges || isSaving">
                                <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
                                {{ isSaving ? 'Saving...' : 'Save Profile' }}
                            </Button>
                            <Button v-if="hasChanges" variant="outline" @click="handleReset" :disabled="isSaving">
                                Cancel
                            </Button>
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
                            <SecurityActionModal type="password">
                                <Button
                                    class="bg-yellow-600 dark:bg-yellow-700 text-white hover:bg-yellow-700 dark:hover:bg-yellow-800 transition-colors">
                                    Change Password
                                </Button>
                            </SecurityActionModal>
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
import { ref, computed, onMounted, watch } from 'vue';
import { ThemeSelector } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-vue-next';
import { useAuth } from '@/features/auth/useAuth';
import { AuthServices } from '@/features/auth/AuthServices';
import { SecurityActionModal } from '@/features/auth/components';
import type { UpdateUserPayload } from '@/types';

const { user, patchUser } = useAuth();
const isSaving = ref(false);

const formData = ref({
    first_name: '',
    last_name: '',
    income: null as number | null
});

// Initial data for change detection
const initialData = ref({
    first_name: '',
    last_name: '',
    income: null as number | null
});

const syncFormData = () => {
    if (user.value) {
        const userFirstName = user.value.first_name || '';
        const userLastName = user.value.last_name || '';
        const userIncome = user.value.income ?? null;

        formData.value.first_name = userFirstName;
        formData.value.last_name = userLastName;
        formData.value.income = userIncome;
        
        initialData.value.first_name = userFirstName;
        initialData.value.last_name = userLastName;
        initialData.value.income = userIncome;
    }
};

onMounted(() => {
    syncFormData();
});

watch(user, () => {
    syncFormData();
}, { immediate: true });

const hasChanges = computed(() => {
    return formData.value.first_name !== initialData.value.first_name ||
           formData.value.last_name !== initialData.value.last_name ||
           formData.value.income !== initialData.value.income;
});

const handleReset = () => {
    formData.value.first_name = initialData.value.first_name;
    formData.value.last_name = initialData.value.last_name;
    formData.value.income = initialData.value.income;
};

const handleSave = async () => {
    if (!hasChanges.value) return;
    
    isSaving.value = true;
    try {
        const payload: UpdateUserPayload = {
            first_name: formData.value.first_name !== initialData.value.first_name ? formData.value.first_name : null,
            last_name: formData.value.last_name !== initialData.value.last_name ? formData.value.last_name : null,
            income: formData.value.income !== initialData.value.income ? formData.value.income : null,
        };
        
        const updatedUser = await AuthServices.updateUser(payload);
        
        // Construct the patch data from what we actually sent
        const patchData: any = {};
        if (payload.first_name !== null) patchData.first_name = payload.first_name;
        if (payload.last_name !== null) patchData.last_name = payload.last_name;
        if (payload.income !== null) patchData.income = payload.income;

        // If backend returned a valid user object with fields, merge that too (higher priority)
        const mergedData = {
            ...patchData,
            ...(updatedUser && typeof updatedUser === 'object' ? updatedUser : {})
        };

        patchUser(mergedData);
    } catch (error) {
        console.error('Failed to update profile:', error);
    } finally {
        isSaving.value = false;
    }
};
</script>