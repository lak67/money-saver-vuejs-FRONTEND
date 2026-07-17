<template>
    <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
            <Label for="amount" class="text-right">
                Amount
            </Label>
            <div class="col-span-3">
                <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input id="amount" :model-value="total_amount" @update:model-value="handleAmountUpdate"
                        @blur="handleAmountBlur" class="pl-8" :class="{ 'border-red-500': amountError }"
                        placeholder="0.00" type="number" step="0.01" min="0" />
                </div>
                <p v-if="amountError" class="text-red-500 text-sm mt-1">{{ amountError }}</p>
            </div>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <Label for="description" class="text-right">
                Description
            </Label>
            <div class="col-span-3">
                <Input id="description" :model-value="description" @update:model-value="handleDescriptionUpdate"
                    @blur="handleDescriptionBlur" class="w-full" :class="{ 'border-red-500': descriptionError }"
                    placeholder="What was this expense for?" />
                <p v-if="descriptionError" class="text-red-500 text-sm mt-1">{{ descriptionError }}</p>
            </div>
        </div>

        <!-- Quick Category Suggestions -->
        <div class="col-span-full">
            <Label class="text-sm text-muted-foreground mb-2 block">Quick Categories:</Label>
            <div class="flex flex-wrap gap-2">
                <button v-for="category in expenseCategories.slice(0, 6)" :key="category" type="button"
                    @click="selectCategory(category)"
                    class="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors">
                    {{ category }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInputView } from "./useInputView"

interface Props {
    total_amount: string
    description: string
}

interface Emits {
    'update:total_amount': [value: string]
    'update:description': [value: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use the composable
const {
    amountError,
    descriptionError,
    expenseCategories,
    validateAmount,
    validateDescription,
    formatAmount,
    clearErrors
} = useInputView()

// Event handlers
const handleAmountUpdate = (value: string | number) => {
    const stringValue = String(value)
    emit('update:total_amount', stringValue)
    if (amountError.value) {
        validateAmount(stringValue) // Re-validate if there was an error
    }
}

const handleDescriptionUpdate = (value: string | number) => {
    const stringValue = String(value)
    emit('update:description', stringValue)
    if (descriptionError.value) {
        validateDescription(stringValue) // Re-validate if there was an error
    }
}

const handleAmountBlur = () => {
    if (validateAmount(props.total_amount) && props.total_amount) {
        // Format the amount when valid
        const formatted = formatAmount.value(props.total_amount)
        if (formatted !== props.total_amount) {
            emit('update:total_amount', formatted)
        }
    }
}

const handleDescriptionBlur = () => {
    validateDescription(props.description)
}

const selectCategory = (category: string) => {
    emit('update:description', category)
}

// Expose validation method for parent component
defineExpose({
    validateForm: () => {
        const isAmountValid = validateAmount(props.total_amount)
        const isDescriptionValid = validateDescription(props.description)
        return isAmountValid && isDescriptionValid
    },
    clearErrors
})
</script>