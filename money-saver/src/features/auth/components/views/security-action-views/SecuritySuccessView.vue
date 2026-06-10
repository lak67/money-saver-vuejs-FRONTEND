<template>
  <div class="flex flex-col items-center justify-center py-8 space-y-4 text-center">
    <div class="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
      <Check class="h-10 w-10 text-green-600 dark:text-green-400" />
    </div>
    <h3 class="text-xl font-bold">Update Successful</h3>
    <p class="text-sm text-muted-foreground">
      Your {{ type }} has been updated successfully.
    </p>
    <p class="text-xs text-muted-foreground italic pt-4">
      You will be logged out in a few seconds...
    </p>
  </div>
</template>

<script setup lang="ts">
import { Check } from "lucide-vue-next";
import type { SecurityActionType } from "@/types";

defineProps<{
  type: SecurityActionType;
}>();
</script>
