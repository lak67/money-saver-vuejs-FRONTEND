<template>
  <div class="space-y-4 py-4">
    <template v-if="type === 'email'">
      <div class="space-y-2">
        <Label for="new-email">New Email Address</Label>
        <Input 
          id="new-email" 
          type="email"
          :model-value="newValue" 
          @update:model-value="$emit('update:newValue', $event)"
          placeholder="Enter new email" 
          autofocus
        />
      </div>
    </template>
    
    <template v-else>
      <div class="space-y-2">
        <Label for="new-password">New Password</Label>
        <Input 
          id="new-password" 
          type="password"
          :model-value="newValue" 
          @update:model-value="$emit('update:newValue', $event)"
          placeholder="Enter new password" 
          autofocus
        />
      </div>
      <div class="space-y-2">
        <Label for="confirm-password">Confirm Password</Label>
        <Input 
          id="confirm-password" 
          type="password"
          :model-value="confirmValue" 
          @update:model-value="$emit('update:confirmValue', $event)"
          placeholder="Confirm new password" 
        />
      </div>
      <p v-if="newValue && confirmValue && newValue !== confirmValue" class="text-xs text-destructive">
        Passwords do not match
      </p>
      <p v-if="newValue && newValue.length > 0 && newValue.length < 8" class="text-xs text-muted-foreground">
        Password must be at least 8 characters
      </p>
    </template>
    
    <p v-if="error" class="text-xs text-destructive mt-2 text-center">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SecurityActionType } from "@/types";

defineProps<{
  type: SecurityActionType;
  newValue: string;
  confirmValue: string;
  error: string | null;
}>();

defineEmits(['update:newValue', 'update:confirmValue']);
</script>
