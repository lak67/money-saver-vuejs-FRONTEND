<template>
    <div class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-bold text-foreground">
                    Create your account
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Already have an account?
                    <router-link to="/login" class="font-medium text-primary hover:text-primary/80">
                        Sign in here
                    </router-link>
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                v-model="form.firstName"
                                type="text"
                                autocomplete="given-name"
                                required
                                class="mt-1"
                                :class="{ 'border-destructive': errors.firstName }"
                                placeholder="First name"
                            />
                            <p v-if="errors.firstName" class="mt-1 text-sm text-destructive">{{ errors.firstName }}</p>
                        </div>

                        <div>
                            <Label for="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                v-model="form.lastName"
                                type="text"
                                autocomplete="family-name"
                                required
                                class="mt-1"
                                :class="{ 'border-destructive': errors.lastName }"
                                placeholder="Last name"
                            />
                            <p v-if="errors.lastName" class="mt-1 text-sm text-destructive">{{ errors.lastName }}</p>
                        </div>
                    </div>

                    <div>
                        <Label for="email">Email address</Label>
                        <Input
                            id="email"
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            required
                            class="mt-1"
                            :class="{ 'border-destructive': errors.email }"
                            placeholder="Enter your email"
                        />
                        <p v-if="errors.email" class="mt-1 text-sm text-destructive">{{ errors.email }}</p>
                    </div>

                    <div>
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            v-model="form.password"
                            type="password"
                            autocomplete="new-password"
                            required
                            class="mt-1"
                            :class="{ 'border-destructive': errors.password }"
                            placeholder="Enter your password"
                        />
                        <div class="mt-2 space-y-1">
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full" :class="passwordValidation.hasMinLength ? 'bg-green-500' : 'bg-gray-300'"></div>
                                <span class="text-xs" :class="passwordValidation.hasMinLength ? 'text-green-600' : 'text-muted-foreground'">
                                    At least 8 characters
                                </span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full" :class="passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'"></div>
                                <span class="text-xs" :class="passwordValidation.hasUpperCase ? 'text-green-600' : 'text-muted-foreground'">
                                    One uppercase letter
                                </span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full" :class="passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'"></div>
                                <span class="text-xs" :class="passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'">
                                    One number
                                </span>
                            </div>
                        </div>
                        <p v-if="errors.password" class="mt-1 text-sm text-destructive">{{ errors.password }}</p>
                    </div>

                    <div>
                        <Label for="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            v-model="form.confirmPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                            class="mt-1"
                            :class="{ 'border-destructive': errors.confirmPassword }"
                            placeholder="Confirm your password"
                        />
                        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-destructive">{{ errors.confirmPassword }}</p>
                    </div>
                </div>

                <!-- Global error message -->
                <div v-if="errors.general" class="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <p class="text-sm text-destructive">{{ errors.general }}</p>
                </div>

                <!-- Success message -->
                <div v-if="successMessage" class="bg-primary/10 border border-primary/20 rounded-md p-3">
                    <p class="text-sm text-primary">{{ successMessage }}</p>
                </div>

                <div>
                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="loading || !isFormValid"
                    >
                        <span v-if="loading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                        </span>
                        <span v-else>Create account</span>
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive, ref, computed } from 'vue'

const store = useStore()
const router = useRouter()

const loading = ref(false)
const successMessage = ref('')

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
})

// Password validation
const passwordValidation = computed(() => {
    const password = form.password
    return {
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        isValid: password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
    }
})

// Form validation
const isFormValid = computed(() => {
    return (
        form.firstName.trim() && 
        form.lastName.trim() && 
        form.email.trim() && 
        passwordValidation.value.isValid &&
        form.password === form.confirmPassword
    )
})

const validateForm = () => {
    // Clear previous errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })
    
    let isValid = true
    
    if (!form.firstName.trim()) {
        errors.firstName = 'First name is required'
        isValid = false
    }
    
    if (!form.lastName.trim()) {
        errors.lastName = 'Last name is required'
        isValid = false
    }
    
    if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
    }
    
    if (!passwordValidation.value.isValid) {
        errors.password = 'Password must meet all requirements'
        isValid = false
    }
    
    if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
        isValid = false
    }
    
    return isValid
}

const handleRegister = async () => {
    if (!validateForm()) return
    
    loading.value = true
    errors.general = ''
    successMessage.value = ''
    
    try {
        const result = await store.dispatch('auth/register', {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password
        })
        
        if (result.success) {
            successMessage.value = 'Account created successfully! Redirecting to dashboard...'
            
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        } else {
            errors.general = result.error || 'Registration failed. Please try again.'
        }
    } catch (error: any) {
        errors.general = error.message || 'An unexpected error occurred. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>