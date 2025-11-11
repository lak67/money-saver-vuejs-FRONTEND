<template>
    <div class="min-h-screen bg-background">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-foreground">Profile Settings</h1>
                <p class="mt-2 text-muted-foreground">
                    Manage your account settings and personal information
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Profile Card -->
                <div class="lg:col-span-1">
                    <div class="bg-card border border-border rounded-lg p-6">
                        <div class="flex flex-col items-center">
                            <!-- Avatar -->
                            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-semibold mb-4">
                                {{ userInitials }}
                            </div>
                            
                            <!-- User Info -->
                            <h3 class="text-lg font-semibold text-foreground">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h3>
                            <p class="text-sm text-muted-foreground mb-4">{{ currentUser?.email }}</p>
                            
                            <!-- Quick Stats -->
                            <div class="w-full space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-muted-foreground">Member since</span>
                                    <span class="text-foreground">Jan 2024</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-muted-foreground">Profile status</span>
                                    <span class="text-green-600">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Form -->
                <div class="lg:col-span-2">
                    <div class="bg-card border border-border rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
                        
                        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                            <!-- Name Fields -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label for="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        v-model="form.firstName"
                                        type="text"
                                        class="mt-1"
                                        :class="{ 'border-destructive': errors.firstName }"
                                        placeholder="Enter your first name"
                                    />
                                    <p v-if="errors.firstName" class="mt-1 text-sm text-destructive">{{ errors.firstName }}</p>
                                </div>

                                <div>
                                    <Label for="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        v-model="form.lastName"
                                        type="text"
                                        class="mt-1"
                                        :class="{ 'border-destructive': errors.lastName }"
                                        placeholder="Enter your last name"
                                    />
                                    <p v-if="errors.lastName" class="mt-1 text-sm text-destructive">{{ errors.lastName }}</p>
                                </div>
                            </div>

                            <!-- Email Field -->
                            <div>
                                <Label for="email">Email Address</Label>
                                <Input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    class="mt-1"
                                    :class="{ 'border-destructive': errors.email }"
                                    placeholder="Enter your email address"
                                />
                                <p v-if="errors.email" class="mt-1 text-sm text-destructive">{{ errors.email }}</p>
                            </div>

                            <!-- Success/Error Messages -->
                            <div v-if="errors.general" class="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                <p class="text-sm text-destructive">{{ errors.general }}</p>
                            </div>

                            <div v-if="successMessage" class="bg-primary/10 border border-primary/20 rounded-md p-3">
                                <p class="text-sm text-primary">{{ successMessage }}</p>
                            </div>

                            <!-- Form Actions -->
                            <div class="flex items-center justify-between pt-6 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    @click="resetForm"
                                    :disabled="loading"
                                >
                                    Reset Changes
                                </Button>
                                
                                <Button
                                    type="submit"
                                    :disabled="loading || !hasChanges"
                                >
                                    <span v-if="loading" class="flex items-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                    <span v-else>Update Profile</span>
                                </Button>
                            </div>
                        </form>
                    </div>

                    <!-- Change Password Section -->
                    <div class="bg-card border border-border rounded-lg p-6 mt-6">
                        <h2 class="text-xl font-semibold text-foreground mb-6">Change Password</h2>
                        
                        <form @submit.prevent="handleChangePassword" class="space-y-6">
                            <div>
                                <Label for="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    v-model="passwordForm.currentPassword"
                                    type="password"
                                    class="mt-1"
                                    :class="{ 'border-destructive': passwordErrors.currentPassword }"
                                    placeholder="Enter your current password"
                                />
                                <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-destructive">{{ passwordErrors.currentPassword }}</p>
                            </div>

                            <div>
                                <Label for="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    v-model="passwordForm.newPassword"
                                    type="password"
                                    class="mt-1"
                                    :class="{ 'border-destructive': passwordErrors.newPassword }"
                                    placeholder="Enter your new password"
                                />
                                <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-destructive">{{ passwordErrors.newPassword }}</p>
                            </div>

                            <div>
                                <Label for="confirmNewPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmNewPassword"
                                    v-model="passwordForm.confirmNewPassword"
                                    type="password"
                                    class="mt-1"
                                    :class="{ 'border-destructive': passwordErrors.confirmNewPassword }"
                                    placeholder="Confirm your new password"
                                />
                                <p v-if="passwordErrors.confirmNewPassword" class="mt-1 text-sm text-destructive">{{ passwordErrors.confirmNewPassword }}</p>
                            </div>

                            <div v-if="passwordErrors.general" class="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                <p class="text-sm text-destructive">{{ passwordErrors.general }}</p>
                            </div>

                            <div class="flex justify-end">
                                <Button
                                    type="submit"
                                    :disabled="passwordLoading"
                                >
                                    <span v-if="passwordLoading" class="flex items-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Changing...
                                    </span>
                                    <span v-else>Change Password</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from 'vuex'
import { reactive, ref, computed, onMounted } from 'vue'

const store = useStore()

const loading = ref(false)
const passwordLoading = ref(false)
const successMessage = ref('')

// Get current user from store
const currentUser = computed(() => store.getters['auth/user'])
const userInitials = computed(() => {
    if (currentUser.value) {
        const first = currentUser.value.firstName?.charAt(0).toUpperCase() || ''
        const last = currentUser.value.lastName?.charAt(0).toUpperCase() || ''
        return first + last || 'U'
    }
    return 'U'
})

// Profile form
const form = reactive({
    firstName: '',
    lastName: '',
    email: ''
})

// Password form
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
})

// Form errors
const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    general: ''
})

const passwordErrors = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    general: ''
})

// Check if form has changes
const hasChanges = computed(() => {
    if (!currentUser.value) return false
    
    return (
        form.firstName !== currentUser.value.firstName ||
        form.lastName !== currentUser.value.lastName ||
        form.email !== currentUser.value.email
    )
})

// Initialize form with current user data
const initializeForm = () => {
    if (currentUser.value) {
        form.firstName = currentUser.value.firstName || ''
        form.lastName = currentUser.value.lastName || ''
        form.email = currentUser.value.email || ''
    }
}

// Reset form to original values
const resetForm = () => {
    initializeForm()
    clearErrors()
    successMessage.value = ''
}

// Clear all errors
const clearErrors = () => {
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })
    Object.keys(passwordErrors).forEach(key => {
        passwordErrors[key as keyof typeof passwordErrors] = ''
    })
}

// Validate profile form
const validateProfileForm = () => {
    clearErrors()
    let isValid = true
    
    if (!form.firstName.trim()) {
        errors.firstName = 'First name is required'
        isValid = false
    }
    
    if (!form.lastName.trim()) {
        errors.lastName = 'Last name is required'
        isValid = false
    }
    
    if (!form.email.trim()) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
    }
    
    return isValid
}

// Validate password form
const validatePasswordForm = () => {
    Object.keys(passwordErrors).forEach(key => {
        passwordErrors[key as keyof typeof passwordErrors] = ''
    })
    
    let isValid = true
    
    if (!passwordForm.currentPassword) {
        passwordErrors.currentPassword = 'Current password is required'
        isValid = false
    }
    
    if (!passwordForm.newPassword) {
        passwordErrors.newPassword = 'New password is required'
        isValid = false
    } else if (passwordForm.newPassword.length < 8) {
        passwordErrors.newPassword = 'Password must be at least 8 characters long'
        isValid = false
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        passwordErrors.confirmNewPassword = 'Passwords do not match'
        isValid = false
    }
    
    return isValid
}

// Handle profile update
const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return
    
    loading.value = true
    successMessage.value = ''
    
    try {
        const result = await store.dispatch('auth/updateProfile', {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email
        })
        
        if (result.success) {
            successMessage.value = 'Profile updated successfully!'
            setTimeout(() => {
                successMessage.value = ''
            }, 3000)
        } else {
            errors.general = result.error || 'Failed to update profile'
        }
    } catch (error: any) {
        errors.general = error.message || 'An unexpected error occurred'
    } finally {
        loading.value = false
    }
}

// Handle password change
const handleChangePassword = async () => {
    if (!validatePasswordForm()) return
    
    passwordLoading.value = true
    
    try {
        // This would call your password change API endpoint
        // For now, we'll simulate success
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Clear password form
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmNewPassword = ''
        
        successMessage.value = 'Password changed successfully!'
        setTimeout(() => {
            successMessage.value = ''
        }, 3000)
    } catch (error: any) {
        passwordErrors.general = error.message || 'Failed to change password'
    } finally {
        passwordLoading.value = false
    }
}

// Initialize component
onMounted(() => {
    initializeForm()
})
</script>