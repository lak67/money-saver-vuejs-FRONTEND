import { API_ENDPOINTS, apiRequest } from "@/lib/api";
import { computed, onMounted, ref } from "vue";
import { UserServices } from "../../../services/user/UserServices";

export type ModalMode = "login" | "register";

export type ModalStep =
  | "login"
  | "register"
  | "income"
  | "budget-types"
  | "budget-amounts"
  | "confirmation"
  | "success";

export interface BudgetType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BudgetAmount {
  budgetTypeId: string;
  total_amount: number;
}

export interface SelectedBudgetType {
  id: string;
  total_amount: number;
}

export function useRegisterModal() {
  // Reactive state
  const email = ref("");
  const password = ref("");
  const yearlyIncome = ref<number | null>(null);
  const selectedBudgetTypes = ref<SelectedBudgetType[]>([]);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const currentMode = ref<ModalMode>("login");
  const currentStep = ref<ModalStep>("login");
  
  // Budget types state - initialize with fallback data
  const defaultBudgetTypes: BudgetType[] = [
    {
      id: "rent",
      name: "Rent",
      icon: "🏠",
      description: "Monthly rent or mortgage payment",
    },
    {
      id: "food",
      name: "Food",
      icon: "🍽️",
      description: "Groceries and dining expenses",
    },
    {
      id: "utilities",
      name: "Utilities",
      icon: "⚡",
      description: "Electric, water, gas, internet",
    },
    {
      id: "car-payment",
      name: "Car Payment",
      icon: "🚗",
      description: "Monthly vehicle loan or lease",
    },
    {
      id: "insurance",
      name: "Insurance",
      icon: "🛡️",
      description: "Health, auto, life insurance",
    },
  ];
  
  const budgetTypes = ref<BudgetType[]>(defaultBudgetTypes);
  const budgetTypesLoading = ref(false);
  const budgetTypesError = ref<string | null>(null);

  const finalEmail = ref("");
  const finalYearlyIncome = ref<number | null>(null);
  const finalBudgets = ref<SelectedBudgetType[]>([]);

  const finalFields = computed(() => ({
    email: finalEmail.value,
    yearlyIncome: finalYearlyIncome.value,
    budgets: finalBudgets.value,
  }));

  // Password validation helper
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return {
      hasMinLength,
      hasUpperCase,
      hasNumber,
      isValid: hasMinLength && hasUpperCase && hasNumber,
    };
  };

  // Computed properties
  const passwordValidation = computed(() => validatePassword(password.value));

  const isRegisterFormValid = computed(() => {
    return (
      email.value.trim().length > 0 &&
      email.value.includes("@") &&
      passwordValidation.value.isValid
    );
  });

  const isLoginFormValid = computed(() => {
    return (
      email.value.trim().length > 0 &&
      email.value.includes("@") &&
      password.value.length > 0
    );
  });

  const isIncomeFormValid = computed(() => {
    return yearlyIncome.value !== null && yearlyIncome.value > 0;
  });

  const isBudgetTypesFormValid = computed(() => {
    return selectedBudgetTypes.value.length > 0;
  });

  const isBudgetAmountsFormValid = computed(() => {
    return selectedBudgetTypes.value.every(
      (budget) => budget.total_amount >= 0
    );
  });

  const currentStepTitle = computed(() => {
    switch (currentStep.value) {
      case "login":
        return "Welcome Back";
      case "register":
        return "Create Your Account";
      case "income":
        return "Enter Your Yearly Income";
      case "budget-types":
        return "Select Your Budget Categories";
      case "budget-amounts":
        return "Set Monthly Budget Amounts";
      case "confirmation":
        return "Confirm Your Information";
      case "success":
        return "Welcome to Money Saver!";
      default:
        return "Sign In";
    }
  });

  // Fetch budget types from API
  const fetchBudgetTypes = async (): Promise<BudgetType[]> => {
    try {
      console.log('Fetching budget types from API...');
      budgetTypesLoading.value = true;
      budgetTypesError.value = null;

      const response = await apiRequest(API_ENDPOINTS.BUDGET_TYPES, {
        method: "POST",
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Map API response to BudgetType interface
      const fetchedBudgetTypes = data.map((item: any) => ({
        id: String(item.id || item.ID),
        name: item.name || item.Name,
        description: item.description || item.Description,
        icon: item.icon || item.Icon || "💰",
      }));

      console.log('Fetched budget types from API:', fetchedBudgetTypes);
      budgetTypes.value = fetchedBudgetTypes;
      console.log('Budget types reactive value set to:', budgetTypes.value);
      return fetchedBudgetTypes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch budget types";
      budgetTypesError.value = errorMessage;
      console.error("Error fetching budget types:", err);
      
      // Keep the default budget types that were already initialized
      console.log("Using default budget types due to API error");
      return budgetTypes.value;
    } finally {
      budgetTypesLoading.value = false;
    }
  };

  // Available budget types (initialized with defaults, updated from API)
  const availableBudgetTypes = computed(() => {
    console.log('Available budget types computed:', budgetTypes.value);
    return budgetTypes.value;
  });

  // Methods
  const openModal = () => {
    isOpen.value = true;
    currentMode.value = "login";
    currentStep.value = "login";
    // Ensure budget types are fetched when modal opens
    if (budgetTypes.value.length === 0) {
      console.log('Fetching budget types on modal open...');
      fetchBudgetTypes();
    }
  };

  const switchToLogin = () => {
    currentMode.value = "login";
    currentStep.value = "login";
    // Clear form fields when switching modes
    email.value = "";
    password.value = "";
  };

  const switchToRegister = () => {
    currentMode.value = "register";
    currentStep.value = "register";
    // Clear form fields and reset register flow
    resetForm();
  };

  // Reset all form fields and state
  const resetFields = () => {
    email.value = "";
    password.value = "";
    yearlyIncome.value = null;
    selectedBudgetTypes.value = [];
    isLoading.value = false;
  };

  const closeModal = () => {
    isOpen.value = false;

    resetFields();

    currentStep.value = "register";
  };

  const nextStep = () => {
    if (currentStep.value === "register") {
      currentStep.value = "income";
    } else if (currentStep.value === "income") {
      currentStep.value = "budget-types";
    } else if (currentStep.value === "budget-types") {
      // Budget amounts are already set in selectedBudgetTypes, just proceed
      currentStep.value = "budget-amounts";
    } else if (currentStep.value === "budget-amounts") {
      currentStep.value = "confirmation";
    } else if (currentStep.value === "confirmation") {
      currentStep.value = "success";
    }
  };

  const previousStep = () => {
    if (currentStep.value === "income") {
      currentStep.value = "register";
    } else if (currentStep.value === "budget-types") {
      currentStep.value = "income";
    } else if (currentStep.value === "budget-amounts") {
      currentStep.value = "budget-types";
    } else if (currentStep.value === "confirmation") {
      currentStep.value = "budget-amounts";
    }
  };

  const goToStep = (step: ModalStep) => {
    currentStep.value = step;
  };

  const submitLogin = async () => {
    if (!isLoginFormValid.value) return;
    
    isLoading.value = true;
    try {
      const loginPayload = {
        email: email.value,
        password: password.value
      };

      console.log('Login payload:', loginPayload);
      
      // Call UserServices login method  
      const result = await UserServices().loginUser(loginPayload);
      console.log('Login successful:', result);
      
      // Handle successful login (you might want to emit an event or navigate)
      // For now, we'll just close the modal
      closeModal();
      
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (you might want to show an error message)
    } finally {
      isLoading.value = false;
    }
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

    const registerUserPayload = {
      first_name: "John",
      last_name: "Doe",
      password: password.value,
      email: email.value,
      income: yearlyIncome.value,
      budget_types: selectedBudgetTypes.value.map(bt => ({
        id: parseInt(bt.id, 10), // Convert string ID to integer
        total_amount: bt.total_amount
      })),
    };

    console.log('Registration payload being sent:', registerUserPayload);
    console.log('Budget types with converted IDs:', registerUserPayload.budget_types);

    try {
      await UserServices().registerUser(registerUserPayload);
      isLoading.value = true;
      nextStep(); // Go to success step
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      isLoading.value = false;

      finalFields.value.email = email.value;
      finalFields.value.yearlyIncome = yearlyIncome.value;
      finalFields.value.budgets = selectedBudgetTypes.value;

      resetFields();
    }

    //login user
  };

  // Budget management methods
  const toggleBudgetType = (budgetTypeId: string) => {
    console.log(`Toggling budget type: ${budgetTypeId}`);
    console.log('Available budget types:', budgetTypes.value.map(bt => ({ id: bt.id, name: bt.name })));
    
    const index = selectedBudgetTypes.value.findIndex(
      (b) => b.id === budgetTypeId
    );
    if (index > -1) {
      selectedBudgetTypes.value.splice(index, 1);
    } else {
      selectedBudgetTypes.value.push({ id: budgetTypeId, total_amount: 0 });
    }
    
    console.log('Selected budget types after toggle:', selectedBudgetTypes.value);
  };

  const updateBudgetAmount = (budgetTypeId: string, amount: number) => {
    const budgetIndex = selectedBudgetTypes.value.findIndex(
      (b) => b.id === budgetTypeId
    );
    if (budgetIndex > -1 && selectedBudgetTypes.value[budgetIndex]) {
      selectedBudgetTypes.value[budgetIndex].total_amount = amount;
    }
  };

  const getBudgetAmount = (budgetTypeId: string) => {
    const budget = selectedBudgetTypes.value.find((b) => b.id === budgetTypeId);
    return budget?.total_amount || 0;
  };

  const getTotalBudgetAmount = () => {
    return selectedBudgetTypes.value.reduce((total, budget) => {
      return total + budget.total_amount;
    }, 0);
  };

  const resetForm = () => {
    email.value = "";
    password.value = "";
    yearlyIncome.value = null;
    selectedBudgetTypes.value = [];
    currentStep.value = "register";
  };

  // Initialize budget types when component mounts
  onMounted(() => {
    fetchBudgetTypes();
  });

  return {
    // State
    email,
    password,
    yearlyIncome,
    selectedBudgetTypes,
    isOpen,
    isLoading,
    currentMode,
    currentStep,

    // Computed
    passwordValidation,
    isRegisterFormValid,
    isLoginFormValid,
    isIncomeFormValid,
    isBudgetTypesFormValid,
    isBudgetAmountsFormValid,
    currentStepTitle,
    availableBudgetTypes,
    finalFields,

    // Methods
    openModal,
    closeModal,
    switchToLogin,
    switchToRegister,
    nextStep,
    previousStep,
    goToStep,
    submitLogin,
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
    fetchBudgetTypes,
    
    // Budget types API state
    budgetTypesLoading,
    budgetTypesError,
  };
}
