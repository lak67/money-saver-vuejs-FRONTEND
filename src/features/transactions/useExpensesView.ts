import { ref, computed, onMounted, nextTick } from 'vue';
import { RecurringServices } from '@/features/budget';
import type { GetUserRecurringPayload } from '@/types';

// Mock Expenses data type
interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  emoji: string;
  description: string;
}

// Base budget type
interface BaseBudget {
  id: string;
  category: string;
  emoji: string;
  amount: number;
  description: string;
}

interface RecurringForm {
  recurring_name: string;
  amount: string;
  active: boolean;
  recurring_date: string;
}

export function useExpensesView() {
  // Tab state
  const activeTab = ref<'log' | 'recurring'>('recurring');

  // Filter values
  const selectedCategory = ref('All Categories');
  const selectedTimeframe = ref('All Time');

  // Search Bar States
  const searchQuery = ref('');
  const isSearchExpanded = ref(false);
  const searchInputRef = ref<HTMLInputElement | null>(null);

  const expandSearch = () => {
    isSearchExpanded.value = true;
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  };

  const retractSearch = () => {
    isSearchExpanded.value = false;
    searchQuery.value = '';
  };

  // Custom Subscription Search Bar States
  const customSearchQuery = ref('');
  const isCustomSearchExpanded = ref(false);
  const customSearchInputRef = ref<HTMLInputElement | null>(null);

  const expandCustomSearch = () => {
    isCustomSearchExpanded.value = true;
    nextTick(() => {
      customSearchInputRef.value?.focus();
    });
  };

  const retractCustomSearch = () => {
    isCustomSearchExpanded.value = false;
    customSearchQuery.value = '';
  };

  // Collapsible sections
  const isBaseExpanded = ref(true);
  const isCustomExpanded = ref(true);

  // Mock Expenses list
  const expenses = ref<Expense[]>([
    { id: 1, title: 'Whole Foods Market', amount: -125.50, date: 'October 15, 2025', category: '🍽️ Food & Dining', emoji: '🍽️', description: 'Weekly grocery shopping' },
    { id: 2, title: 'Pacific Gas & Electric', amount: -87.25, date: 'October 14, 2025', category: '⚡ Utilities', emoji: '⚡', description: 'Monthly electricity bill' },
    { id: 3, title: 'Shell Gas Station', amount: -45.00, date: 'October 13, 2025', category: '🚗 Transportation', emoji: '🚗', description: 'Fuel for commute' },
    { id: 4, title: 'Monthly Rent', amount: -1200.00, date: 'October 1, 2025', category: '🏠 Housing', emoji: '🏠', description: 'Apartment rent payment' },
    { id: 5, title: 'Health Insurance', amount: -320.00, date: 'October 1, 2025', category: '🛡️ Insurance', emoji: '🛡️', description: 'Monthly premium' },
  ]);

  const filteredExpenses = computed(() => {
    return expenses.value.filter(expense => {
      // Search query matching
      const matchesSearch = searchQuery.value === '' || 
        expense.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.value.toLowerCase());

      // Category matching
      const matchesCategory = selectedCategory.value === 'All Categories' || 
        expense.category.toLowerCase().includes(selectedCategory.value.toLowerCase());

      // Timeframe matching placeholder
      let matchesTime = true;
      if (selectedTimeframe.value === 'This Month') {
        matchesTime = expense.date.includes('October');
      }

      return matchesSearch && matchesCategory && matchesTime;
    });
  });

  // Base budgets state
  const baseBudgets = ref<BaseBudget[]>([
    { id: 'food', category: 'Food & Dining', emoji: '🍽️', amount: 500.00, description: 'Groceries & Dining' },
    { id: 'utilities', category: 'Utilities', emoji: '⚡', amount: 300.00, description: 'Electric, Water, Gas, Internet' },
    { id: 'transportation', category: 'Transportation', emoji: '🚗', amount: 400.00, description: 'Car payments, Gas, Public transit' },
    { id: 'housing', category: 'Housing', emoji: '🏠', amount: 1200.00, description: 'Apartment rent payment' },
    { id: 'insurance', category: 'Insurance', emoji: '🛡️', amount: 800.00, description: 'Health, Auto, Life insurance' },
  ]);

  // Base Budgets Search Bar States
  const baseSearchQuery = ref('');
  const isBaseSearchExpanded = ref(false);
  const baseSearchInputRef = ref<HTMLInputElement | null>(null);

  const expandBaseSearch = () => {
    isBaseSearchExpanded.value = true;
    nextTick(() => {
      baseSearchInputRef.value?.focus();
    });
  };

  const retractBaseSearch = () => {
    isBaseSearchExpanded.value = false;
    baseSearchQuery.value = '';
  };

  const filteredBaseBudgets = computed(() => {
    if (!baseSearchQuery.value) return baseBudgets.value;
    const query = baseSearchQuery.value.toLowerCase();
    return baseBudgets.value.filter(item => 
      item.category.toLowerCase().includes(query) ||
      item.amount.toString().toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  // CRUD Base Budgets States
  const showAddBaseForm = ref(false);
  const editingBaseId = ref<string | null>(null);

  interface BaseForm {
    category: string;
    amount: string;
    emoji: string;
    description: string;
  }

  const newBase = ref<BaseForm>({
    category: '',
    amount: '',
    emoji: '',
    description: ''
  });

  const editBaseData = ref<BaseForm>({
    category: '',
    amount: '',
    emoji: '',
    description: ''
  });

  const openAddBaseForm = () => {
    isBaseExpanded.value = true;
    showAddBaseForm.value = true;
    newBase.value = {
      category: '',
      amount: '',
      emoji: '📊',
      description: 'Custom base budget'
    };
  };

  const closeAddBaseForm = () => {
    showAddBaseForm.value = false;
  };

  const submitAddBaseForm = () => {
    if (!newBase.value.category || !newBase.value.amount) return;
    const newId = 'base_' + Date.now();
    baseBudgets.value.unshift({
      id: newId,
      category: newBase.value.category,
      amount: parseFloat(newBase.value.amount) || 0,
      emoji: newBase.value.emoji || '📊',
      description: newBase.value.description || 'Custom base budget'
    });
    showAlert('Base budget added successfully');
    closeAddBaseForm();
  };

  const startEditingBase = (item: BaseBudget) => {
    editingBaseId.value = item.id;
    editBaseData.value = {
      category: item.category,
      amount: item.amount.toString(),
      emoji: item.emoji,
      description: item.description
    };
  };

  const cancelEditingBase = () => {
    editingBaseId.value = null;
  };

  const submitEditBaseForm = (id: string) => {
    if (!editBaseData.value.category || !editBaseData.value.amount) return;
    const idx = baseBudgets.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      const currentItem = baseBudgets.value[idx];
      if (currentItem) {
        baseBudgets.value[idx] = {
          id,
          category: editBaseData.value.category,
          amount: parseFloat(editBaseData.value.amount) || 0,
          emoji: editBaseData.value.emoji,
          description: editBaseData.value.description || currentItem.description
        };
      }
    }
    showAlert('Base budget updated successfully');
    editingBaseId.value = null;
  };

  const deleteBaseBudget = (id: string) => {
    if (!confirm('Are you sure you want to delete this base budget?')) return;
    baseBudgets.value = baseBudgets.value.filter(item => item.id !== id);
    showAlert('Base budget deleted successfully');
  };

  // Custom Recurring expenses state
  const customRecurringList = ref<GetUserRecurringPayload[]>([]);

  const filteredCustomRecurringList = computed(() => {
    if (!customSearchQuery.value) return customRecurringList.value;
    const query = customSearchQuery.value.toLowerCase();
    return customRecurringList.value.filter(item => 
      item.recurring_name.toLowerCase().includes(query) ||
      item.amount.toString().toLowerCase().includes(query)
    );
  });

  // Alerts toast state
  const alertMessage = ref('');
  const alertType = ref<'success' | 'error'>('success');

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    alertMessage.value = message;
    alertType.value = type;
    setTimeout(() => {
      alertMessage.value = '';
    }, 4000);
  };

  // CRUD Recurring Forms State
  const showAddForm = ref(false);
  const editingId = ref<number | null>(null);
  const isSubmitting = ref(false);

  const addNameInputRef = ref<HTMLInputElement | null>(null);
  const editNameInputRef = ref<any>(null);

  const newRecurringDateInput = ref('');
  const editRecurringDateInput = ref('');
  let prevCreateLength = 0;
  let prevEditLength = 0;

  const formatDateInput = (val: string, prevLength: number): string => {
    let digits = val.replace(/\D/g, '');
    if (digits.length === 0) return '';
    
    let mm = '';
    if (digits.length >= 1) {
      const firstChar = digits.charAt(0);
      if (firstChar !== '0' && firstChar !== '1') {
        mm = '0' + firstChar;
        digits = '0' + digits; 
      } else {
        mm = firstChar;
      }
    }
    
    if (digits.length >= 2) {
      const monthNum = parseInt(digits.slice(0, 2), 10);
      if (monthNum < 1 || monthNum > 12) {
        if (digits.slice(0, 2) === '00') {
          mm = '01';
        } else {
          mm = '1';
        }
        digits = mm + digits.slice(2);
      } else {
        mm = digits.slice(0, 2);
      }
    }
    
    if (digits.length <= 2) {
      if (digits.length === 2 && val.length > prevLength) {
        return mm + '/';
      }
      return mm;
    }
    
    let dd = digits.slice(2, 4);
    if (dd.length >= 1) {
      const firstDayChar = dd.charAt(0);
      if (firstDayChar !== '0' && firstDayChar !== '1' && firstDayChar !== '2' && firstDayChar !== '3') {
        dd = '0' + firstDayChar;
        digits = digits.slice(0, 2) + '0' + digits.slice(2);
      }
    }
    
    if (dd.length === 2) {
      const dayNum = parseInt(dd, 10);
      const monthNum = parseInt(mm, 10);
      const year = new Date().getFullYear();
      const maxDays = new Date(year, monthNum, 0).getDate();
      
      if (dayNum < 1 || dayNum > maxDays) {
        if (dd === '00') {
          dd = '01';
        } else {
          dd = String(maxDays).padStart(2, '0');
        }
      }
    }
    
    return `${mm}/${dd}`;
  };

  const onDateInput = (e: Event, type: 'create' | 'edit') => {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    const prevLength = type === 'create' ? prevCreateLength : prevEditLength;
    
    const formatted = formatDateInput(val, prevLength);
    
    if (type === 'create') {
      newRecurringDateInput.value = formatted;
      prevCreateLength = formatted.length;
    } else {
      editRecurringDateInput.value = formatted;
      prevEditLength = formatted.length;
    }
  };

  const formatISOToMMDD = (isoStr: string): string => {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return '';
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${mm}/${dd}`;
  };

  const parseMMDDToISO = (mmdd: string): string => {
    const parts = mmdd.split('/');
    const mmStr = parts[0] || '1';
    const ddStr = parts[1] || '1';
    const mm = parseInt(mmStr, 10) - 1;
    const dd = parseInt(ddStr, 10);
    
    const year = new Date().getFullYear();
    const dateObj = new Date(year, mm, dd, 12, 0, 0);
    return dateObj.toISOString();
  };

  const validateMMDD = (mmdd: string): boolean => {
    if (mmdd.length !== 5) return false;
    const parts = mmdd.split('/');
    if (parts.length !== 2) return false;
    
    const mmStr = parts[0];
    const ddStr = parts[1];
    if (!mmStr || !ddStr) return false;
    
    const mm = parseInt(mmStr, 10);
    const dd = parseInt(ddStr, 10);
    
    if (isNaN(mm) || isNaN(dd)) return false;
    if (mm < 1 || mm > 12) return false;
    
    const year = new Date().getFullYear();
    const maxDays = new Date(year, mm, 0).getDate();
    if (dd < 1 || dd > maxDays) return false;
    
    return true;
  };

  const newRecurring = ref<RecurringForm>({
    recurring_name: '',
    amount: '',
    active: true,
    recurring_date: ''
  });

  const editRecurringData = ref<RecurringForm>({
    recurring_name: '',
    amount: '',
    active: true,
    recurring_date: ''
  });

  const fetchRecurringList = async () => {
    try {
      const response = await RecurringServices.getUserRecurring();
      customRecurringList.value = response?.user_recurring || [];
    } catch (error: any) {
      console.error('Failed to fetch recurring list', error);
      showAlert(error.message || 'Failed to fetch recurring subscriptions', 'error');
    }
  };

  onMounted(() => {
    fetchRecurringList();
  });

  const openAddForm = () => {
    isCustomExpanded.value = true;
    showAddForm.value = true;
    newRecurring.value = {
      recurring_name: '',
      amount: '',
      active: true,
      recurring_date: ''
    };
    newRecurringDateInput.value = formatISOToMMDD(new Date().toISOString());
    prevCreateLength = newRecurringDateInput.value.length;
    nextTick(() => {
      addNameInputRef.value?.focus();
    });
  };

  const closeAddForm = () => {
    showAddForm.value = false;
  };

  const submitAddForm = async () => {
    if (!newRecurring.value.recurring_name || !newRecurring.value.amount) return;
    
    if (!validateMMDD(newRecurringDateInput.value)) {
      showAlert('Invalid date. Please use MM/DD format (e.g. 06/24)', 'error');
      return;
    }
    
    isSubmitting.value = true;
    
    const payload = {
      recurring_name: newRecurring.value.recurring_name,
      amount: parseFloat(newRecurring.value.amount) || 0,
      active: newRecurring.value.active,
      recurring_date: parseMMDDToISO(newRecurringDateInput.value)
    };

    try {
      await RecurringServices.createUserRecurring(payload);
      showAlert('Recurring subscription created successfully');
      await fetchRecurringList();
      
      // Clear fields only on success
      newRecurring.value = {
        recurring_name: '',
        amount: '',
        active: true,
        recurring_date: ''
      };
      newRecurringDateInput.value = '';
      prevCreateLength = 0;
      
      closeAddForm();
    } catch (error: any) {
      console.error('Failed to create subscription', error);
      showAlert(error.message || 'Failed to create subscription', 'error');
    } finally {
      isSubmitting.value = false;
    }
  };

  const startEditingRecurring = (item: GetUserRecurringPayload) => {
    editingId.value = item.id;
    editRecurringData.value = {
      recurring_name: item.recurring_name,
      amount: item.amount.toString(),
      active: item.active,
      recurring_date: ''
    };
    
    editRecurringDateInput.value = formatISOToMMDD(item.recurring_date);
    prevEditLength = editRecurringDateInput.value.length;

    nextTick(() => {
      const el = editNameInputRef.value;
      if (el) {
        if (Array.isArray(el)) {
          el[0]?.focus();
        } else {
          el.focus();
        }
      }
    });
  };

  const cancelEditingRecurring = () => {
    editingId.value = null;
  };

  const submitEditForm = async (id: number) => {
    if (!editRecurringData.value.recurring_name || !editRecurringData.value.amount) return;
    
    if (!validateMMDD(editRecurringDateInput.value)) {
      showAlert('Invalid date. Please use MM/DD format (e.g. 06/24)', 'error');
      return;
    }
    
    isSubmitting.value = true;

    const payload = {
      id: id,
      recurring_name: editRecurringData.value.recurring_name,
      amount: parseFloat(editRecurringData.value.amount) || 0,
      active: editRecurringData.value.active,
      recurring_date: parseMMDDToISO(editRecurringDateInput.value)
    };

    try {
      await RecurringServices.updateUserRecurring(payload);
      showAlert('Subscription updated successfully');
      await fetchRecurringList();
      editingId.value = null;
    } catch (error: any) {
      console.error('Failed to update subscription', error);
      showAlert(error.message || 'Failed to update subscription', 'error');
    } finally {
      isSubmitting.value = false;
    }
  };

  const isDeleteModalOpen = ref(false);
  const subscriptionToDelete = ref<GetUserRecurringPayload | null>(null);
  const isDeleteSubmitting = ref(false);

  const startDeleteRecurring = (item: GetUserRecurringPayload) => {
    subscriptionToDelete.value = item;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    subscriptionToDelete.value = null;
  };

  const confirmDeleteRecurring = async () => {
    if (!subscriptionToDelete.value) return;
    const id = subscriptionToDelete.value.id;
    isDeleteSubmitting.value = true;

    try {
      await RecurringServices.deleteUserRecurring(id);
      showAlert('Subscription deleted successfully');
      await fetchRecurringList();
      closeDeleteModal();
    } catch (error: any) {
      console.error('Failed to delete subscription', error);
      showAlert(error.message || 'Failed to delete subscription', 'error');
    } finally {
      isDeleteSubmitting.value = false;
    }
  };

  // Formatting helpers
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Placeholder actions
  const openAddExpenseModal = () => {
    showAlert('Add Expense feature placeholder', 'success');
  };

  const editExpense = (expense: Expense) => {
    showAlert(`Editing ${expense.title} (placeholder)`, 'success');
  };

  return {
    activeTab,
    selectedCategory,
    selectedTimeframe,
    searchQuery,
    isSearchExpanded,
    searchInputRef,
    expandSearch,
    retractSearch,
    customSearchQuery,
    isCustomSearchExpanded,
    customSearchInputRef,
    expandCustomSearch,
    retractCustomSearch,
    isBaseExpanded,
    isCustomExpanded,
    expenses,
    filteredExpenses,
    baseBudgets,
    filteredBaseBudgets,
    baseSearchQuery,
    isBaseSearchExpanded,
    baseSearchInputRef,
    expandBaseSearch,
    retractBaseSearch,
    showAddBaseForm,
    editingBaseId,
    newBase,
    editBaseData,
    openAddBaseForm,
    closeAddBaseForm,
    submitAddBaseForm,
    startEditingBase,
    cancelEditingBase,
    submitEditBaseForm,
    deleteBaseBudget,
    customRecurringList,
    filteredCustomRecurringList,
    alertMessage,
    alertType,
    showAlert,
    showAddForm,
    editingId,
    isSubmitting,
    addNameInputRef,
    editNameInputRef,
    newRecurringDateInput,
    editRecurringDateInput,
    onDateInput,
    newRecurring,
    editRecurringData,
    openAddForm,
    closeAddForm,
    submitAddForm,
    startEditingRecurring,
    cancelEditingRecurring,
    submitEditForm,
    isDeleteModalOpen,
    subscriptionToDelete,
    isDeleteSubmitting,
    startDeleteRecurring,
    closeDeleteModal,
    confirmDeleteRecurring,
    formatDate,
    openAddExpenseModal,
    editExpense
  };
}
