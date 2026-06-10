<script setup lang="ts">
import { ref } from 'vue';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useSecurityActionModal } from "./useSecurityActionModal"
import { RequestCodeView, VerifyCodeView, UpdateFieldView, SecuritySuccessView } from "./views"
import type { SecurityActionType } from "@/types"

const props = defineProps<{
    type: SecurityActionType
}>()

const isOpen = ref(false)

const {
    currentStep,
    currentStepTitle,
    isLoading,
    error,
    code,
    newValue,
    confirmValue,
    resendCooldown,
    canSendCode,
    isCodeValid,
    isUpdateValid,
    sendCode,
    resendCode,
    verifyCode,
    updateField,
    reset
} = useSecurityActionModal(props.type)

const handleFormSubmit = () => {
    switch (currentStep.value) {
        case 'initial':
            sendCode()
            break
        case 'verify':
            verifyCode()
            break
        case 'update':
            updateField()
            break
    }
}

const handleOpenChange = (val: boolean) => {
    isOpen.value = val
    if (!val) {
        reset()
    }
}
</script>

<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogTrigger as-child>
            <slot>
                <Button variant="outline">
                    Change {{ type === 'password' ? 'Password' : 'Email' }}
                </Button>
            </slot>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <form @submit.prevent="handleFormSubmit" class="contents">
                <DialogHeader>
                    <DialogTitle>{{ currentStepTitle }}</DialogTitle>
                </DialogHeader>

                <RequestCodeView 
                    v-if="currentStep === 'initial'" 
                    :type="type"
                    :is-loading="isLoading"
                    :can-send-code="canSendCode"
                    :resend-cooldown="resendCooldown"
                    :error="error"
                    @send-code="sendCode"
                />

                <VerifyCodeView 
                    v-if="currentStep === 'verify'" 
                    v-model:code="code"
                    :is-loading="isLoading"
                    :resend-cooldown="resendCooldown"
                    :error="error"
                    @resend-code="resendCode"
                />

                <UpdateFieldView 
                    v-if="currentStep === 'update'" 
                    :type="type"
                    v-model:new-value="newValue"
                    v-model:confirm-value="confirmValue"
                    :error="error"
                />

                <SecuritySuccessView 
                    v-if="currentStep === 'success'" 
                    :type="type"
                />

                <DialogFooter v-if="currentStep !== 'success'">
                    <Button 
                        v-if="currentStep === 'verify'" 
                        type="submit" 
                        :disabled="!isCodeValid || isLoading"
                        class="w-full"
                    >
                        Verify Code
                    </Button>
                    <Button 
                        v-if="currentStep === 'update'" 
                        type="submit" 
                        :disabled="!isUpdateValid || isLoading"
                        class="w-full"
                    >
                        Update {{ type === 'password' ? 'Password' : 'Email' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
