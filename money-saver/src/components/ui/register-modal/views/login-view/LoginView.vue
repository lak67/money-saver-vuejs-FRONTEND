<template>
    <div class="space-y-4">
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Welcome Back</h3>
            <p class="text-sm text-muted-foreground">
                Sign in to your Money Saver account
            </p>
        </div>

        <div class="space-y-4">
            <!-- Email field (always visible) -->
            <div class="space-y-2">
                <Label for="login-email">Email Address</Label>
                <div class="relative">
                    <Input id="login-email" :model-value="props.email" @update:model-value="handleEmailUpdate"
                        class="w-full pr-9" placeholder="Enter your email" type="email" required
                        :disabled="props.loginEmailCheckState === 'loading'" />
                    <!-- Inline status icon -->
                    <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <!-- Loading spinner -->
                        <svg v-if="props.loginEmailCheckState === 'loading'"
                            class="w-4 h-4 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <!-- Valid check -->
                        <svg v-else-if="props.loginEmailCheckState === 'valid'" class="w-4 h-4 text-green-500"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M5 13l4 4L19 7" />
                        </svg>
                        <!-- Invalid x -->
                        <svg v-else-if="props.loginEmailCheckState === 'invalid'" class="w-4 h-4 text-red-500"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                <!-- Email check error -->
                <p v-if="props.loginEmailCheckState === 'invalid' && props.loginEmailCheckError"
                    class="text-xs text-red-500 flex items-center gap-1">
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ props.loginEmailCheckError }}
                </p>

                <!-- Loading hint -->
                <p v-else-if="props.loginEmailCheckState === 'loading'" class="text-xs text-muted-foreground">
                    Looking up your account…
                </p>
            </div>

            <!-- Password + error — only visible once email is confirmed valid -->
            <Transition name="slide-down">
                <div v-if="props.loginEmailCheckState === 'valid'" class="space-y-3">
                    <!-- Wrong-password error message -->
                    <div v-if="props.errorMessage"
                        class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ props.errorMessage }}
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="login-password">Password</Label>
                        <div class="relative">
                            <Input id="login-password" :model-value="props.password"
                                @update:model-value="handlePasswordUpdate" :type="showPassword ? 'text' : 'password'"
                                class="w-full pr-9" placeholder="Enter your password" required />
                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                :aria-label="showPassword ? 'Hide password' : 'Show password'">
                                <!-- Eye-off (hide) -->
                                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <!-- Eye (show) -->
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Forgot Password Link -->
                    <div class="text-right">
                        <button type="button" class="text-sm text-primary hover:underline"
                            @click="handleForgotPassword">
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EmailCheckState } from "../../useRegisterModal"

const showPassword = ref(false)

interface Props {
    email: string
    password: string
    isLoading?: boolean
    errorMessage?: string | null
    loginEmailCheckState?: EmailCheckState
    loginEmailCheckError?: string | null
}

interface Emits {
    (e: 'update:email', value: string): void
    (e: 'update:password', value: string): void
    (e: 'forgot-password'): void
}

const props = withDefaults(defineProps<Props>(), {
    loginEmailCheckState: 'idle',
    loginEmailCheckError: null,
    errorMessage: null,
})
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
</script>

<style scoped>
.slide-down-enter-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.slide-down-leave-active {
    transition: all 0.2s ease;
    overflow: hidden;
}

.slide-down-enter-from {
    opacity: 0;
    max-height: 0;
}

.slide-down-enter-to {
    opacity: 1;
    max-height: 160px;
}

.slide-down-leave-from {
    opacity: 1;
    max-height: 160px;
}

.slide-down-leave-to {
    opacity: 0;
    max-height: 0;
}
</style>
