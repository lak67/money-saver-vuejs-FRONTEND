<template>
    <div class="flex flex-col items-center justify-center py-8 text-center space-y-4">
        <!-- Success Animation -->
        <div class="text-6xl animate-pulse">🎉</div>

        <div class="space-y-2">
            <h3 class="text-xl font-semibold text-green-600">Welcome to Money Saver!</h3>
            <p class="text-sm text-muted-foreground max-w-sm">
                Your account has been successfully created with your personalized budget plan.
            </p>
        </div>

        <!-- Quick Summary -->
        <div class="bg-green-50 p-4 rounded-lg w-full">
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-green-700">Account:</span>
                    <span class="font-medium">{{ finalFields.email }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-green-700">Yearly Income:</span>
                    <span class="font-medium">${{ finalFields.yearlyIncome?.toLocaleString() || '0' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-green-700">Budget Categories:</span>
                    <span class="font-medium">Ready to use!</span>
                </div>
            </div>
        </div>

        <div class="text-center space-y-2">
            <p class="text-sm text-muted-foreground">
                🎯 You're all set to start tracking your expenses and managing your budget!
            </p>
        </div>

    </div>
</template>

<script setup lang="ts">
interface Props {
    finalFields: {
        email: string
        yearlyIncome: number | null
    }
}

defineProps<Props>()
</script>