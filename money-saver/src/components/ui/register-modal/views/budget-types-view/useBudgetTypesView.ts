import { computed, ref } from 'vue'
import type { BudgetType } from '../../useRegisterModal'

export function useBudgetTypesView() {
  // Local state for search and filtering
  const searchTerm = ref('')
  const showRecommended = ref(true)

  // Recommended budget types for first-time users
  const recommendedBudgetIds = ref(['rent', 'utilities', 'groceries', 'savings', 'transportation'])

  // Computed properties
  const filteredBudgetTypes = computed(() => (availableTypes: BudgetType[]) => {
    let filtered = availableTypes

    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase()
      filtered = filtered.filter(type => 
        type.name.toLowerCase().includes(search) ||
        type.description.toLowerCase().includes(search)
      )
    }

    return filtered
  })

  const getRecommendedTypes = computed(() => (availableTypes: BudgetType[]) => {
    return availableTypes.filter(type => 
      recommendedBudgetIds.value.includes(type.id)
    )
  })

  const getOtherTypes = computed(() => (availableTypes: BudgetType[]) => {
    return availableTypes.filter(type => 
      !recommendedBudgetIds.value.includes(type.id)
    )
  })

  const getSelectionSummary = computed(() => (selectedIds: string[], availableTypes: BudgetType[]) => {
    const selectedTypes = availableTypes.filter(type => 
      selectedIds.includes(type.id)
    )
    
    if (selectedTypes.length === 0) {
      return 'No budget categories selected'
    }
    
    if (selectedTypes.length === 1) {
      return `1 category selected: ${selectedTypes[0]?.name || 'Unknown'}`
    }
    
    return `${selectedTypes.length} categories selected`
  })

  // Methods
  const clearSearch = () => {
    searchTerm.value = ''
  }

  const selectRecommended = (availableTypes: BudgetType[], onToggle: (id: string) => void, selectedIds: string[]) => {
    const recommendedTypes = getRecommendedTypes.value(availableTypes)
    
    recommendedTypes.forEach(type => {
      if (!selectedIds.includes(type.id)) {
        onToggle(type.id)
      }
    })
  }

  const clearAll = (selectedIds: string[], onToggle: (id: string) => void) => {
    selectedIds.forEach(id => {
      onToggle(id)
    })
  }

  const validateSelection = (selectedIds: string[]) => {
    return selectedIds.length > 0
  }

  return {
    // State
    searchTerm,
    showRecommended,
    recommendedBudgetIds,

    // Computed
    filteredBudgetTypes,
    getRecommendedTypes,
    getOtherTypes,
    getSelectionSummary,

    // Methods
    clearSearch,
    selectRecommended,
    clearAll,
    validateSelection
  }
}