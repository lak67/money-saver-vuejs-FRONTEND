<template>
  <div class="space-y-4 py-4">
    <div class="space-y-2">
      <Label for="code">Verification Code</Label>
      <Input 
        id="code" 
        :model-value="code" 
        @update:model-value="$emit('update:code', $event)"
        placeholder="Enter 6-digit code" 
        maxlength="6"
        class="text-center text-2xl tracking-[0.5em] font-bold"
        autofocus
      />
      <p class="text-xs text-muted-foreground text-center">
        Enter the 6-digit code sent to your email.
      </p>
    </div>
    
    <div class="flex flex-col items-center pt-4">
      <button 
        type="button"
        @click="$emit('resend-code')" 
        :disabled="isLoading || resendCooldown > 0"
        class="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
      >
        Resend Code {{ resendCooldown > 0 ? `(${resendCooldown}s)` : '' }}
      </button>
      <p v-if="error" class="text-xs text-destructive mt-2 text-center">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

defineProps<{
  code: string;
  isLoading: boolean;
  resendCooldown: number;
  error: string | null;
}>();

defineEmits(['update:code', 'resend-code']);
</script>
