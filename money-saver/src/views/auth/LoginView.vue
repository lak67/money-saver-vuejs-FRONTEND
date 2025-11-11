<template>
    <div class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-bold text-foreground">
                    Sign in to your account
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Or
                    <router-link to="/register" class="font-medium text-primary hover:text-primary/80">
                        create a new account
                    </router-link>
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="space-y-4">
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
                            autocomplete="current-password"
                            required
                            class="mt-1"
                            :class="{ 'border-destructive': errors.password }"
                            placeholder="Enter your password"
                        />
                        <p v-if="errors.password" class="mt-1 text-sm text-destructive">{{ errors.password }}</p>
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
                        :disabled="loading"
                    >
                        <span v-if="loading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                        <span v-else>Sign in</span>
                    </Button>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <a href="#" class="font-medium text-primary hover:text-primary/80">
                            Forgot your password?
                        </a>
                    </div>
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
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref } from 'vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const successMessage = ref('')

const form = reactive({
    email: '',
    password: ''
})

const errors = reactive({
    email: '',
    password: '',
    general: ''
})

const validateForm = () => {
    // Clear previous errors
    errors.email = ''
    errors.password = ''
    errors.general = ''
    
    let isValid = true
    
    if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
    }
    
    if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
    } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
        isValid = false
    }
    
    return isValid
}

const handleLogin = async () => {
    if (!validateForm()) return
    
    loading.value = true
    errors.general = ''
    successMessage.value = ''
    
    try {
        const result = await store.dispatch('auth/login', {
            email: form.email,
            password: form.password
        })
        
        if (result.success) {
            successMessage.value = 'Login successful! Redirecting...'
            
            // Redirect to intended page or dashboard
            const redirectTo = route.query.redirect as string || '/dashboard'
            setTimeout(() => {
                router.push(redirectTo)
            }, 1500)
        } else {
            errors.general = result.error || 'Login failed. Please try again.'
        }
    } catch (error: any) {
        errors.general = error.message || 'An unexpected error occurred. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>