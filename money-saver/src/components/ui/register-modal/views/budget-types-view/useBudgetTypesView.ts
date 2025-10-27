import { API_ENDPOINTS, apiRequest } from "@/lib/api";
import { computed, onMounted, ref } from "vue";
import type { BudgetType } from "../../useRegisterModal";

export function useBudgetTypesView(providedBudgetTypes?: BudgetType[]) {
  // Local state for search and filtering
  const searchTerm = ref("");
  const showRecommended = ref(true);
  const budgetTypes = ref<BudgetType[]>(providedBudgetTypes || []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Recommended budget types for first-time users
  const recommendedBudgetIds = ref([
    "rent",
    "utilities",
    "groceries",
    "savings",
    "transportation",
  ]);

  // API Functions
  const fetchBudgetTypes = async (): Promise<BudgetType[]> => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiRequest(API_ENDPOINTS.BUDGET_TYPES, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming your API returns an array of budget types
      // Adjust the data structure mapping as needed based on your API response
      budgetTypes.value = data.map((item: any) => ({
        id: item.id || item.ID,
        name: item.name || item.Name,
        description: item.description || item.Description,
        icon: item.icon || item.Icon || "💰",
      }));

      return budgetTypes.value;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch budget types";
      error.value = errorMessage;
      console.error("Error fetching budget types:", err);

      // Return fallback budget types if API fails
      const fallbackTypes: BudgetType[] = [
        {
          id: "rent",
          name: "Rent",
          description: "Monthly housing rent",
          icon: "🏠",
        },
        {
          id: "utilities",
          name: "Utilities",
          description: "Electric, water, gas, internet",
          icon: "⚡",
        },
        {
          id: "groceries",
          name: "Groceries",
          description: "Food and household items",
          icon: "🛒",
        },
        {
          id: "savings",
          name: "Savings",
          description: "Emergency fund and investments",
          icon: "💰",
        },
        {
          id: "transportation",
          name: "Transportation",
          description: "Car payments, gas, public transit",
          icon: "🚗",
        },
      ];
      budgetTypes.value = fallbackTypes;
      return fallbackTypes;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize budget types on mount
  onMounted(() => {
    // Only fetch if no budget types were provided
    if (!providedBudgetTypes || providedBudgetTypes.length === 0) {
      fetchBudgetTypes();
    }
  });

  // Computed properties
  const filteredBudgetTypes = computed(() => {
    let filtered = budgetTypes.value;

    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase();
      filtered = filtered.filter(
        (type) =>
          type.name.toLowerCase().includes(search) ||
          type.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  const getRecommendedTypes = computed(() => {
    return budgetTypes.value.filter((type) =>
      recommendedBudgetIds.value.includes(type.id)
    );
  });

  const getOtherTypes = computed(() => {
    return budgetTypes.value.filter(
      (type) => !recommendedBudgetIds.value.includes(type.id)
    );
  });

  const getSelectionSummary = computed(() => (selectedIds: string[]) => {
    const selectedTypes = budgetTypes.value.filter((type) =>
      selectedIds.includes(type.id)
    );

    if (selectedTypes.length === 0) {
      return "No budget categories selected";
    }

    if (selectedTypes.length === 1) {
      return `1 category selected: ${selectedTypes[0]?.name || "Unknown"}`;
    }

    return `${selectedTypes.length} categories selected`;
  });

  // Get budget types with selection status
  const getBudgetTypesWithSelection = computed(
    () => (selectedIds: string[]) => {
      return budgetTypes.value.map((type) => ({
        ...type,
        isSelected: selectedIds.includes(type.id),
      }));
    }
  );

  // Methods
  const clearSearch = () => {
    searchTerm.value = "";
  };

  const selectRecommended = (
    onToggle: (id: string) => void,
    selectedIds: string[]
  ) => {
    const recommendedTypes = getRecommendedTypes.value;

    recommendedTypes.forEach((type: BudgetType) => {
      if (!selectedIds.includes(type.id)) {
        onToggle(type.id);
      }
    });
  };

  const clearAll = (selectedIds: string[], onToggle: (id: string) => void) => {
    selectedIds.forEach((id) => {
      onToggle(id);
    });
  };

  const validateSelection = (selectedIds: string[]) => {
    return selectedIds.length > 0;
  };

  const refreshBudgetTypes = () => {
    return fetchBudgetTypes();
  };

  return {
    // State
    searchTerm,
    showRecommended,
    recommendedBudgetIds,
    budgetTypes,
    isLoading,
    error,

    // Computed
    filteredBudgetTypes,
    getRecommendedTypes,
    getOtherTypes,
    getSelectionSummary,
    getBudgetTypesWithSelection,

    // Methods
    clearSearch,
    selectRecommended,
    clearAll,
    validateSelection,
    fetchBudgetTypes,
    refreshBudgetTypes,
  };
}
