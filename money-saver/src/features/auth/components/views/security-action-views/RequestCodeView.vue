<template>
  <div class="space-y-4 py-4">
    <p class="text-sm text-muted-foreground">
      To change your {{ type }}, we need to verify your identity. We will send a 6-digit verification code to your email address.
    </p>
    <div class="flex flex-col items-center justify-center py-6">
      <Button 
        @click="$emit('send-code')" 
        :disabled="isLoading || !canSendCode"
        size="lg"
        class="w-full sm:w-auto"
      >
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Send Verification Code
      </Button>
      <p v-if="resendCooldown > 0" class="text-xs text-muted-foreground mt-2">
        You can resend the code in {{ resendCooldown }} seconds
      </p>
      <p v-if="error" class="text-xs text-destructive mt-4 text-center">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";
import type { SecurityActionType } from "@/types";

defineProps<{
  type: SecurityActionType;
  isLoading: boolean;
  canSendCode: boolean;
  resendCooldown: number;
  error: string | null;
}>();

defineEmits(['send-code']);
</script>
