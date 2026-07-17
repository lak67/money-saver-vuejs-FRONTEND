import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type { BudgetType, SelectedBudgetType } from "@/types";
import { computed, onMounted, ref, watch } from "vue";
import { AuthServices } from "../AuthServices";

export type ModalMode = "login" | "register";

export type EmailCheckState = "idle" | "loading" | "valid" | "invalid";

export type ModalStep =
  | "login"
  | "register"
  | "income"
  | "budget-types"
  | "budget-amounts"
  | "confirmation"
  | "success"
  | "register-error";

export interface BudgetAmount {
  budgetTypeId: string;
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
  const loginError = ref<string | null>(null);
  const registrationError = ref<string | null>(null);

  // Email check state for register flow
  const emailCheckState = ref<EmailCheckState>("idle");
  const emailCheckError = ref<string | null>(null);
  const shakePasswordHint = ref(false);

  // Email check state for login flow
  const loginEmailCheckState = ref<EmailCheckState>("idle");
  const loginEmailCheckError = ref<string | null>(null);

  // Budget types state - initialize with fallback data
  const defaultBudgetTypes: BudgetType[] = [
    {
      id: "rent",
      type_name: "Rent",
      icon: "🏠",
      description: "Monthly rent or mortgage payment",
    },
    {
      id: "food",
      type_name: "Food",
      icon: "🍽️",
      description: "Groceries and dining expenses",
    },
    {
      id: "utilities",
      type_name: "Utilities",
      icon: "⚡",
      description: "Electric, water, gas, internet",
    },
    {
      id: "car-payment",
      type_name: "Car Payment",
      icon: "🚗",
      description: "Monthly vehicle loan or lease",
    },
    {
      id: "insurance",
      type_name: "Insurance",
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

  // True when email field has a plausible format (used to gate the email-check call)
  const isEmailFormatValid = computed(() => {
    return email.value.trim().length > 0 && email.value.includes("@");
  });

  const isIncomeFormValid = computed(() => {
    return yearlyIncome.value !== null && yearlyIncome.value > 0;
  });

  const isBudgetTypesFormValid = computed(() => {
    return selectedBudgetTypes.value.length > 0;
  });

  const isBudgetAmountsFormValid = computed(() => {
    return selectedBudgetTypes.value.every(
      (budget) => budget.total_amount >= 0,
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
      case "register-error":
        return "Registration Failed";
      default:
        return "Sign In";
    }
  });

  // Fetch budget types from API
  const fetchBudgetTypes = async (): Promise<BudgetType[]> => {
    try {
      budgetTypesLoading.value = true;
      budgetTypesError.value = null;

      const data = await apiClient.post<any[]>(API_ENDPOINTS.BUDGET_TYPES);

      // Map API response to BudgetType interface
      const fetchedBudgetTypes = data.map((item: any) => ({
        id: String(item.id || item.ID),
        type_name: item.type_name || item.TypeName,
        description: item.description || item.Description,
        icon: item.icon || item.Icon || "💰",
      }));

      budgetTypes.value = fetchedBudgetTypes;
      return fetchedBudgetTypes;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch budget types";
      budgetTypesError.value = errorMessage;
      // console.error("Error fetching budget types:", err);

      // Keep the default budget types that were already initialized
      return budgetTypes.value;
    } finally {
      budgetTypesLoading.value = false;
    }
  };

  // Available budget types (initialized with defaults, updated from API)
  const availableBudgetTypes = computed(() => budgetTypes.value);

  // Register flow: valid when the email is NOT yet taken
  const checkEmail = async () => {
    if (!isEmailFormatValid.value) return;

    emailCheckState.value = "loading";
    emailCheckError.value = null;

    try {
      const exists = await AuthServices.checkEmailExists(email.value);
      if (exists) {
        emailCheckState.value = "invalid";
        emailCheckError.value = "This email is already registered.";
      } else {
        emailCheckState.value = "valid";
      }
    } catch (err) {
      emailCheckState.value = "invalid";
      emailCheckError.value =
        err instanceof Error
          ? err.message
          : "Unable to verify email. Please try again.";
    }
  };

  // Login flow: valid when the email IS found in the system
  const checkUserExists = async () => {
    if (!isEmailFormatValid.value) return;

    loginEmailCheckState.value = "loading";
    loginEmailCheckError.value = null;

    try {
      const exists = await AuthServices.checkEmailExists(email.value);
      if (exists) {
        loginEmailCheckState.value = "valid";
      } else {
        loginEmailCheckState.value = "invalid";
        loginEmailCheckError.value =
          "No account found with this email address.";
      }
    } catch (err) {
      loginEmailCheckState.value = "invalid";
      loginEmailCheckError.value =
        err instanceof Error
          ? err.message
          : "Unable to verify email. Please try again.";
    }
  };

  // Clear login error when user starts typing
  watch([email, password], () => {
    if (loginError.value) {
      loginError.value = null;
    }
  });

  // Reset email check state when the email field changes
  watch(email, () => {
    if (emailCheckState.value !== "idle") {
      emailCheckState.value = "idle";
      emailCheckError.value = null;
    }
    if (loginEmailCheckState.value !== "idle") {
      loginEmailCheckState.value = "idle";
      loginEmailCheckError.value = null;
    }
  });

  // Methods
  const openModal = () => {
    isOpen.value = true;
    currentMode.value = "login";
    currentStep.value = "login";
    // Ensure budget types are fetched when modal opens
    if (budgetTypes.value.length === 0) {
      fetchBudgetTypes();
    }
  };

  const switchToLogin = () => {
    currentMode.value = "login";
    currentStep.value = "login";
    // Clear form fields when switching modes
    email.value = "";
    password.value = "";
    loginError.value = null;
    loginEmailCheckState.value = "idle";
    loginEmailCheckError.value = null;
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
    emailCheckState.value = "idle";
    emailCheckError.value = null;
    loginEmailCheckState.value = "idle";
    loginEmailCheckError.value = null;
    registrationError.value = null;
    shakePasswordHint.value = false;
  };

  const closeModal = () => {
    isOpen.value = false;

    resetFields();

    currentStep.value = "login";
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
    if (!isEmailFormatValid.value) return;

    // Phase 1: check that the account exists
    if (
      loginEmailCheckState.value === "idle" ||
      loginEmailCheckState.value === "invalid"
    ) {
      await checkUserExists();
      return;
    }

    if (loginEmailCheckState.value === "loading") return;

    // Phase 2: account confirmed — attempt sign-in
    if (!password.value.trim()) return;

    isLoading.value = true;
    loginError.value = null;

    try {
      const loginPayload = {
        email: email.value,
        password: password.value,
      };

      // Call AuthServices login method
      await AuthServices.loginUser(loginPayload);

      // Update auth context after successful login
      const { useAuth } = await import("../useAuth");
      const { refreshAuth } = useAuth();
      await refreshAuth();

      // Handle successful login
      closeModal();
    } catch (error) {
      // console.error('Login failed:', error);
      loginError.value = "Incorrect email or password. Please try again.";
    } finally {
      isLoading.value = false;
    }
  };

  const submitRegister = async () => {
    if (!isEmailFormatValid.value) return;

    // Email not yet verified — run the check first
    if (
      emailCheckState.value === "idle" ||
      emailCheckState.value === "invalid"
    ) {
      await checkEmail();
      return;
    }

    if (emailCheckState.value === "loading") return;

    // Email is valid — now validate password before advancing
    if (emailCheckState.value === "valid") {
      if (!passwordValidation.value.isValid) {
        // Shake the password hint button to hint at requirements
        shakePasswordHint.value = true;
        setTimeout(() => {
          shakePasswordHint.value = false;
        }, 700);
        return;
      }
      nextStep(); // Go to income step
    }
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
    registrationError.value = null;

    const registerUserPayload = {
      first_name: "John",
      last_name: "Doe",
      password: password.value,
      email: email.value,
      income: yearlyIncome.value,
      budget_types: selectedBudgetTypes.value.map((bt) => ({
        id: parseInt(bt.id, 10), // Convert string ID to integer
        total_amount: bt.total_amount,
      })),
    };

    try {
      await AuthServices.registerUser(registerUserPayload);

      // Update auth context after successful registration
      const { useAuth } = await import("../useAuth");
      const { refreshAuth } = useAuth();
      await refreshAuth();

      // Capture summary fields before reset
      finalEmail.value = email.value;
      finalYearlyIncome.value = yearlyIncome.value;
      finalBudgets.value = [...selectedBudgetTypes.value];

      resetFields();
      nextStep(); // Go to success step
    } catch (error) {
      registrationError.value =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      currentStep.value = "register-error";
    } finally {
      isLoading.value = false;
    }
  };

  // Retry registration — go back to confirmation step from error state
  const retryRegistration = () => {
    registrationError.value = null;
    currentStep.value = "confirmation";
  };

  // Start over from the register step
  const startOver = () => {
    registrationError.value = null;
    resetForm();
  };

  // Budget management methods
  const toggleBudgetType = (budgetTypeId: string) => {
    const index = selectedBudgetTypes.value.findIndex(
      (b) => b.id === budgetTypeId,
    );
    if (index > -1) {
      selectedBudgetTypes.value.splice(index, 1);
    } else {
      selectedBudgetTypes.value.push({ id: budgetTypeId, total_amount: 0 });
    }
  };

  const updateBudgetAmount = (budgetTypeId: string, amount: number) => {
    const budgetIndex = selectedBudgetTypes.value.findIndex(
      (b) => b.id === budgetTypeId,
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
    emailCheckState.value = "idle";
    emailCheckError.value = null;
    loginEmailCheckState.value = "idle";
    loginEmailCheckError.value = null;
    registrationError.value = null;
    shakePasswordHint.value = false;
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
    loginError,
    registrationError,

    // Email check state
    emailCheckState,
    emailCheckError,
    shakePasswordHint,

    // Login email check state
    loginEmailCheckState,
    loginEmailCheckError,

    // Computed
    passwordValidation,
    isEmailFormatValid,
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
    retryRegistration,
    startOver,
    toggleBudgetType,
    updateBudgetAmount,
    getBudgetAmount,
    getTotalBudgetAmount,
    resetForm,
    fetchBudgetTypes,
    checkEmail,
    checkUserExists,

    // Budget types API state
    budgetTypesLoading,
    budgetTypesError,
  };
}
