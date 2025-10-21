<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useRegisterModal } from "./useRegisterModal"
import { BudgetAmountsView, BudgetConfirmationView, BudgetTypesView, IncomeView, RegisterView, SuccessView } from "./views"

// Use the composable
const {
    email,
    password,
    yearlyIncome,
    selectedBudgetTypes,
    isLoading,
    currentStep,
    currentStepTitle,
    passwordValidation,
    isRegisterFormValid,
    isIncomeFormValid,
    isBudgetTypesFormValid,
    isBudgetAmountsFormValid,
    availableBudgetTypes,
    submitRegister,
    submitIncome,
    submitBudgetTypes,
    submitBudgetAmounts,
    registerUser,
    toggleBudgetType,
    updateBudgetAmount,
    previousStep,
    resetForm,
    closeModal
} = useRegisterModal()
</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button class="" variant="default">
                Money Saver
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[500px] max-h-[75vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ currentStepTitle }}</DialogTitle>
            </DialogHeader>

            <!-- Register Step -->
            <RegisterView v-if="currentStep === 'register'" :email="email" :password="password"
                :password-validation="passwordValidation" @update:email="email = $event"
                @update:password="password = $event" />

            <!-- Income Step -->
            <IncomeView v-if="currentStep === 'income'" :yearly-income="yearlyIncome"
                @update:yearly-income="yearlyIncome = $event" />

            <!-- Budget Types Step -->
            <BudgetTypesView v-if="currentStep === 'budget-types'" :available-budget-types="availableBudgetTypes"
                :selected-budget-types="selectedBudgetTypes.map(b => b.id)" @toggle="toggleBudgetType" />

            <!-- Budget Amounts Step -->
            <BudgetAmountsView v-if="currentStep === 'budget-amounts'" :available-budget-types="availableBudgetTypes"
                :selected-budget-types="selectedBudgetTypes"
                @update-amount="updateBudgetAmount" />

            <!-- Confirmation Step -->
            <BudgetConfirmationView v-if="currentStep === 'confirmation'" :email="email" :yearly-income="yearlyIncome"
                :available-budget-types="availableBudgetTypes"
                :selected-budget-types="selectedBudgetTypes" />

            <!-- Success Step -->
            <SuccessView v-if="currentStep === 'success'" :email="email" :yearly-income="yearlyIncome" />

            <DialogFooter class="gap-2">
                <!-- Register Step Footer -->
                <template v-if="currentStep === 'register'">
                    <Button type="button" variant="default" @click="resetForm" :disabled="isLoading">
                        Reset
                    </Button>
                    <Button type="submit" @click="submitRegister" :disabled="!isRegisterFormValid || isLoading">
                        Next →
                    </Button>
                </template>

                <!-- Income Step Footer -->
                <template v-if="currentStep === 'income'">
                    <Button type="button" variant="default" @click="previousStep" :disabled="isLoading">
                        ← Back
                    </Button>
                    <Button type="submit" @click="submitIncome" :disabled="!isIncomeFormValid || isLoading">
                        Next →
                    </Button>
                </template>

                <!-- Budget Types Step Footer -->
                <template v-if="currentStep === 'budget-types'">
                    <Button type="button" variant="default" @click="previousStep" :disabled="isLoading">
                        ← Back
                    </Button>
                    <Button type="submit" @click="submitBudgetTypes" :disabled="!isBudgetTypesFormValid || isLoading">
                        Next →
                    </Button>
                </template>

                <!-- Budget Amounts Step Footer -->
                <template v-if="currentStep === 'budget-amounts'">
                    <Button type="button" variant="default" @click="previousStep" :disabled="isLoading">
                        ← Back
                    </Button>
                    <Button type="submit" @click="submitBudgetAmounts"
                        :disabled="!isBudgetAmountsFormValid || isLoading">
                        Review →
                    </Button>
                </template>

                <!-- Confirmation Step Footer -->
                <template v-if="currentStep === 'confirmation'">
                    <Button type="button" variant="default" @click="previousStep" :disabled="isLoading">
                        ← Edit
                    </Button>
                    <Button type="submit" @click="registerUser" :disabled="isLoading">
                        {{ isLoading ? 'Creating Account...' : 'Complete Registration' }}
                    </Button>
                </template>

                <!-- Success Step Footer -->
                <template v-if="currentStep === 'success'">
                    <Button type="button" @click="closeModal">
                        Get Started
                    </Button>
                </template>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>