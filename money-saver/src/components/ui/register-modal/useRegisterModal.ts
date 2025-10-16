import { computed, ref } from "vue";

export type ModalStep = 'register' | 'income' | 'budget-types' | 'budget-amounts' | 'confirmation' | 'success';

export interface BudgetType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BudgetAmount {
  budgetTypeId: string;
  amount: number;
}

export function useRegisterModal() {
  // Reactive state
  const email = ref("");
  const password = ref("");
  const yearlyIncome = ref<number | null>(null);
  const selectedBudgetTypes = ref<string[]>([]);
  const budgetAmounts = ref<BudgetAmount[]>([]);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const currentStep = ref<ModalStep>('register');

  // Password validation helper
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { hasMinLength, hasUpperCase, hasNumber, isValid: hasMinLength && hasUpperCase && hasNumber };
  };

  // Computed properties
  const passwordValidation = computed(() => validatePassword(password.value));

  const isRegisterFormValid = computed(() => {
    return email.value.trim().length > 0 && 
           email.value.includes('@') && 
           passwordValidation.value.isValid;
  });

  const isIncomeFormValid = computed(() => {
    return yearlyIncome.value !== null && yearlyIncome.value > 0;
  });

  const isBudgetTypesFormValid = computed(() => {
    return selectedBudgetTypes.value.length > 0;
  });

  const isBudgetAmountsFormValid = computed(() => {
    return budgetAmounts.value.every(budget => 
      budget.amount >= 0
    );
  });

  const currentStepTitle = computed(() => {
    switch (currentStep.value) {
      case 'register':
        return 'Create Your Account';
      case 'income':
        return 'Enter Your Yearly Income';
      case 'budget-types':
        return 'Select Your Budget Categories';
      case 'budget-amounts':
        return 'Set Monthly Budget Amounts';
      case 'confirmation':
        return 'Confirm Your Information';
      case 'success':
        return 'Welcome to Money Saver!';
      default:
        return 'Register';
    }
  });

  // Available budget types
  const availableBudgetTypes = computed((): BudgetType[] => [
    {
      id: 'rent',
      name: 'Rent',
      icon: '🏠',
      description: 'Monthly rent or mortgage payment'
    },
    {
      id: 'food',
      name: 'Food',
      icon: '🍽️',
      description: 'Groceries and dining expenses'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: '⚡',
      description: 'Electric, water, gas, internet'
    },
    {
      id: 'car-payment',
      name: 'Car Payment',
      icon: '🚗',
      description: 'Monthly vehicle loan or lease'
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: '🛡️',
      description: 'Health, auto, life insurance'
    }
  ]);

  // Methods
  const openModal = () => {
    isOpen.value = true;
    currentStep.value = 'register';
  };

  const closeModal = () => {
    isOpen.value = false;
    currentStep.value = 'register';
  };

  const nextStep = () => {
    if (currentStep.value === 'register') {
      currentStep.value = 'income';
    } else if (currentStep.value === 'income') {
      currentStep.value = 'budget-types';
    } else if (currentStep.value === 'budget-types') {
      // Initialize budget amounts for selected types, defaulting to 0
      budgetAmounts.value = selectedBudgetTypes.value.map(typeId => ({
        budgetTypeId: typeId,
        amount: 0
      }));
      currentStep.value = 'budget-amounts';
    } else if (currentStep.value === 'budget-amounts') {
      currentStep.value = 'confirmation';
    } else if (currentStep.value === 'confirmation') {
      currentStep.value = 'success';
    }
  };

  const previousStep = () => {
    if (currentStep.value === 'income') {
      currentStep.value = 'register';
    } else if (currentStep.value === 'budget-types') {
      currentStep.value = 'income';
    } else if (currentStep.value === 'budget-amounts') {
      currentStep.value = 'budget-types';
    } else if (currentStep.value === 'confirmation') {
      currentStep.value = 'budget-amounts';
    }
  };

  const goToStep = (step: ModalStep) => {
    currentStep.value = step;
  };

  const submitRegister = async () => {
    if (!isRegisterFormValid.value) return;
    nextStep(); // Go to income step
  };

  const submitIncome = async () => {
    if (!isIncomeFormValid.value) return;
    nextStep(); // Go to budget types step
  };

  const submitBudgetTypes = async () => {
    if (!isBudgetTypesFormValid.value) return;
    nextStep(); // Go to budget amounts step
  };

  const submitBudgetAmounts = async () => {
    if (!isBudgetAmountsFormValid.value) return;
    nextStep(); // Go to confirmation step
  };

  const registerUser = async () => {
    isLoading.value = true;
    try {
      // Simulate API call for final registration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registering user with all data:", { 
        email: email.value, 
        yearlyIncome: yearlyIncome.value,
        budgetTypes: selectedBudgetTypes.value,
        budgetAmounts: budgetAmounts.value
      });
      nextStep(); // Go to success step
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Budget management methods
  const toggleBudgetType = (budgetTypeId: string) => {
    const index = selectedBudgetTypes.value.indexOf(budgetTypeId);
    if (index > -1) {
      selectedBudgetTypes.value.splice(index, 1);
    } else {
      selectedBudgetTypes.value.push(budgetTypeId);
    }
  };

  const updateBudgetAmount = (budgetTypeId: string, amount: number) => {
    const budgetIndex = budgetAmounts.value.findIndex(b => b.budgetTypeId === budgetTypeId);
    if (budgetIndex > -1 && budgetAmounts.value[budgetIndex]) {
      budgetAmounts.value[budgetIndex].amount = amount;
    } else {
      budgetAmounts.value.push({ budgetTypeId, amount });
    }
  };

  const getBudgetAmount = (budgetTypeId: string) => {
    const budget = budgetAmounts.value.find(b => b.budgetTypeId === budgetTypeId);
    return budget?.amount || 0;
  };

  const getTotalBudgetAmount = () => {
    return budgetAmounts.value.reduce((total, budget) => {
      return total + budget.amount;
    }, 0);
  };



  const resetForm = () => {
    email.value = "";
    password.value = "";
    yearlyIncome.value = null;
    selectedBudgetTypes.value = [];
    budgetAmounts.value = [];
    currentStep.value = 'register';
  };

  return {
    // State
    email,
    password,
    yearlyIncome,
    selectedBudgetTypes,
    budgetAmounts,
    isOpen,
    isLoading,
    currentStep,

    // Computed
    passwordValidation,
    isRegisterFormValid,
    isIncomeFormValid,
    isBudgetTypesFormValid,
    isBudgetAmountsFormValid,
    currentStepTitle,
    availableBudgetTypes,

    // Methods
    openModal,
    closeModal,
    nextStep,
    previousStep,
    goToStep,
    submitRegister,
    submitIncome,
    submitBudgetTypes,
    submitBudgetAmounts,
    registerUser,
    toggleBudgetType,
    updateBudgetAmount,
    getBudgetAmount,
    getTotalBudgetAmount,
    resetForm,
  };
}
