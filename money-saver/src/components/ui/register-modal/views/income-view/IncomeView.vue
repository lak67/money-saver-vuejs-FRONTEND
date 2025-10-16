<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    yearlyIncome: number | null
}

interface Emits {
    (e: 'update:yearly-income', value: number | null): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleIncomeChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value === '' ? null : parseFloat(target.value)
    emit('update:yearly-income', value)
}
</script>

<template>
    <div class="space-y-4">
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">What's your yearly income?</h3>
            <p class="text-sm text-muted-foreground">
                This helps us create a personalized budget plan for you
            </p>
        </div>

        <div class="space-y-2">
            <Label for="yearly-income">Yearly Income (USD)</Label>
            <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input id="yearly-income" type="number" placeholder="0" :value="yearlyIncome || ''"
                    @input="handleIncomeChange" class="pl-6" min="0" step="1000" />
            </div>
            <p class="text-xs text-muted-foreground">
                Enter your gross annual income before taxes
            </p>
        </div>
    </div>
</template>