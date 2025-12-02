<template>
    <div class="space-y-4">
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Welcome Back</h3>
            <p class="text-sm text-muted-foreground">
                Sign in to your Money Saver account
            </p>
        </div>

        <!-- Error Message -->
        <div v-if="props.errorMessage"
            class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm">
            <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ props.errorMessage }}
            </div>
        </div>

        <div class="space-y-4">
            <div class="space-y-2">
                <Label for="login-email">Email Address</Label>
                <Input id="login-email" :model-value="props.email" @update:model-value="handleEmailUpdate"
                    class="w-full" placeholder="Enter your email" type="email" required />
            </div>

            <div class="space-y-2">
                <Label for="login-password">Password</Label>
                <Input id="login-password" :model-value="props.password" @update:model-value="handlePasswordUpdate"
                    type="password" class="w-full" placeholder="Enter your password" required />
            </div>

            <!-- Forgot Password Link -->
            <div class="text-right">
                <button type="button" class="text-sm text-primary hover:underline" @click="handleForgotPassword">
                    Forgot your password?
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    email: string
    password: string
    isLoading?: boolean
    errorMessage?: string | null
}

interface Emits {
    (e: 'update:email', value: string): void
    (e: 'update:password', value: string): void
    (e: 'forgot-password'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleEmailUpdate = (value: string | number) => {
    emit('update:email', String(value))
}

const handlePasswordUpdate = (value: string | number) => {
    emit('update:password', String(value))
}

const handleForgotPassword = () => {
    emit('forgot-password')
}

// Expose validation for parent
defineExpose({
    validateForm: () => {
        return props.email.length > 0 && props.password.length > 0
    }
})
</script>