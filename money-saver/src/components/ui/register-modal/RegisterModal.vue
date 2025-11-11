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
import { BudgetAmountsView, BudgetConfirmationView, BudgetTypesView, IncomeView, LoginView, RegisterView, SuccessView } from "./views"

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
    isLoginFormValid,
    isIncomeFormValid,
    isBudgetTypesFormValid,
    isBudgetAmountsFormValid,
    availableBudgetTypes,
    finalFields,
    switchToLogin,
    switchToRegister,
    submitLogin,
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
                Get Started
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[500px] max-h-[75vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ currentStepTitle }}</DialogTitle>
            </DialogHeader>

            <!-- Login Step -->
            <LoginView v-if="currentStep === 'login'" :email="email" :password="password" @update:email="email = $event"
                @update:password="password = $event" />

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
                :selected-budget-types="selectedBudgetTypes" @update-amount="updateBudgetAmount" />

            <!-- Confirmation Step -->
            <BudgetConfirmationView v-if="currentStep === 'confirmation'" :email="email" :yearly-income="yearlyIncome"
                :available-budget-types="availableBudgetTypes" :selected-budget-types="selectedBudgetTypes" />

            <!-- Success Step -->
            <SuccessView v-if="currentStep === 'success'" :finalFields="finalFields" />

            <DialogFooter class="gap-2">
                <!-- Login Step Footer -->
                <template v-if="currentStep === 'login'">
                    <div class="flex items-center justify-between w-full">
                        <button type="button" @click="switchToRegister"
                            class="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group">
                            Register
                            <span
                                class="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 ease-out group-hover:w-full"></span>
                        </button>
                        <Button type="submit" @click="submitLogin" :disabled="!isLoginFormValid || isLoading">
                            <span v-if="isLoading">Signing in...</span>
                            <span v-else>Sign In</span>
                        </Button>
                    </div>
                </template>

                <!-- Register Step Footer -->
                <template v-if="currentStep === 'register'">
                    <div class="flex items-center justify-between w-full">
                        <button type="button" @click="switchToLogin"
                            class="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group">
                            Login
                            <span
                                class="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 ease-out group-hover:w-full"></span>
                        </button>
                        <div class="flex gap-2">
                            <Button type="button" variant="outline" @click="resetForm" :disabled="isLoading">
                                Reset
                            </Button>
                            <Button type="submit" @click="submitRegister" :disabled="!isRegisterFormValid || isLoading">
                                Next →
                            </Button>
                        </div>
                    </div>
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