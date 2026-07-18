import { ref, computed } from 'vue';
import { AuthServices } from '../AuthServices';
import { useAuth } from '../useAuth';
import type { SecurityActionType } from '@/types';

export function useSecurityActionModal(type: SecurityActionType) {
    const { logout } = useAuth();
    
    const currentStep = ref<'initial' | 'verify' | 'update' | 'success'>('initial');
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    
    const code = ref('');
    const newValue = ref('');
    const confirmValue = ref('');
    
    const resendCooldown = ref(0);
    let cooldownTimer: number | null = null;

    const startCooldown = () => {
        resendCooldown.value = 60; // 60 seconds cooldown
        if (cooldownTimer) clearInterval(cooldownTimer);
        cooldownTimer = window.setInterval(() => {
            if (resendCooldown.value > 0) {
                resendCooldown.value--;
            } else {
                if (cooldownTimer) clearInterval(cooldownTimer);
            }
        }, 1000);
    };

    const currentStepTitle = computed(() => {
        const actionLabel = type === 'password' ? 'Password' : 'Email';
        switch (currentStep.value) {
            case 'initial': return `Change ${actionLabel}`;
            case 'verify': return 'Verify Code';
            case 'update': return `New ${actionLabel}`;
            case 'success': return 'Success';
            default: return `Change ${actionLabel}`;
        }
    });

    const canSendCode = computed(() => resendCooldown.value === 0 && !isLoading.value);
    const isCodeValid = computed(() => code.value.length === 6 && /^\d+$/.test(code.value));
    
    const isUpdateValid = computed(() => {
        if (type === 'email') {
            return newValue.value.includes('@') && newValue.value.length > 5;
        } else {
            return newValue.value.length >= 8 && newValue.value === confirmValue.value;
        }
    });

    const sendCode = async () => {
        if (!canSendCode.value) return;
        
        isLoading.value = true;
        error.value = null;
        try {
            await AuthServices.requestSecurityCode(type);
            currentStep.value = 'verify';
            startCooldown();
        } catch (err: any) {
            error.value = err.message || 'Failed to send verification code';
        } finally {
            isLoading.value = false;
        }
    };

    const resendCode = async () => {
        if (!canSendCode.value) return;
        
        isLoading.value = true;
        error.value = null;
        try {
            await AuthServices.requestSecurityCode(type);
            startCooldown();
        } catch (err: any) {
            error.value = err.message || 'Failed to resend verification code';
        } finally {
            isLoading.value = false;
        }
    };

    const verifyCode = async () => {
        if (!isCodeValid.value) return;
        
        isLoading.value = true;
        error.value = null;
        try {
            await AuthServices.verifySecurityCode(type, code.value);
            currentStep.value = 'update';
        } catch (err: any) {
            error.value = err.message || 'Invalid or expired code';
        } finally {
            isLoading.value = false;
        }
    };

    const updateField = async () => {
        if (!isUpdateValid.value) return;
        
        isLoading.value = true;
        error.value = null;
        try {
            await AuthServices.updateSecurityField(type, newValue.value, code.value);
            currentStep.value = 'success';
            
            // Logout after successful update as per requirements
            setTimeout(async () => {
                await logout();
            }, 3000);
        } catch (err: any) {
            error.value = err.message || `Failed to update ${type}`;
        } finally {
            isLoading.value = false;
        }
    };

    const reset = () => {
        currentStep.value = 'initial';
        isLoading.value = false;
        error.value = null;
        code.value = '';
        newValue.value = '';
        confirmValue.value = '';
    };

    return {
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
    };
}
