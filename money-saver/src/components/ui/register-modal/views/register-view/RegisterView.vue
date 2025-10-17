<template>
    <div class="space-y-4">
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Create Your Account</h3>
            <p class="text-sm text-muted-foreground">
                Join Money Saver to start managing your finances
            </p>
        </div>

        <div class="space-y-4">
            <div class="space-y-2">
                <Label for="email">Email Address</Label>
                <Input id="email" :model-value="props.email" @update:model-value="handleEmailUpdate" class="w-full"
                    placeholder="Enter your email" type="email" required />
            </div>

            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <Label for="password">Password</Label>
                    <div class="group relative">
                        <Button variant="default" size="sm" class="h-5 w-5 p-0 rounded-full" type="button">
                            <span class="text-xs">?</span>
                        </Button>
                        <div
                            class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-10">
                            <div class="bg-popover border rounded-md p-3 shadow-md text-xs w-48">
                                <p class="font-medium mb-2">Password Requirements:</p>
                                <ul class="space-y-1">
                                    <li class="flex items-center gap-1">
                                        <span
                                            :class="props.passwordValidation.hasMinLength ? 'text-green-500' : 'text-muted-foreground'">✓</span>
                                        At least 8 characters
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <span
                                            :class="props.passwordValidation.hasUpperCase ? 'text-green-500' : 'text-muted-foreground'">✓</span>
                                        One uppercase letter
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <span
                                            :class="props.passwordValidation.hasNumber ? 'text-green-500' : 'text-muted-foreground'">✓</span>
                                        One number
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Input id="password" :model-value="props.password" @update:model-value="handlePasswordUpdate"
                    type="password" class="w-full" placeholder="Enter your password" required />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordValidation {
    hasMinLength: boolean
    hasUpperCase: boolean
    hasNumber: boolean
    isValid: boolean
}

interface Props {
    email: string
    password: string
    passwordValidation: PasswordValidation
}

interface Emits {
    'update:email': [value: string]
    'update:password': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
    email: 'l@g.com',
    password: 'Password123'
})
const emit = defineEmits<Emits>()

// Event handlers
const handleEmailUpdate = (value: string | number) => {
    emit('update:email', String(value))
}

const handlePasswordUpdate = (value: string | number) => {
    emit('update:password', String(value))
}
</script>