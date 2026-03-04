<template>
    <div class="flex flex-col items-center justify-center py-8 text-center space-y-4">
        <!-- Error Icon -->
        <div class="text-6xl">😞</div>

        <div class="space-y-2">
            <h3 class="text-xl font-semibold text-red-600 dark:text-red-400">Registration Failed</h3>
            <p class="text-sm text-muted-foreground max-w-sm">
                Something went wrong while creating your account. Please try again or go back to edit your information.
            </p>
        </div>

        <!-- Error Detail -->
        <div v-if="errorMessage"
            class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm w-full text-left">
            <div class="flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ errorMessage }}</span>
            </div>
        </div>

        <p class="text-sm text-muted-foreground">
            You can go back to edit your information or try submitting again.
        </p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    errorMessage?: string | null
}

defineProps<Props>()
</script>
