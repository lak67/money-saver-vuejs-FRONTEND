<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Expenses Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">Expenses</h1>
          <p class="text-muted-foreground">Track and manage your spending</p>
        </div>

        <!-- Add Button (conditional on active tab) -->
        <button v-if="activeTab === 'log'" @click="openAddExpenseModal"
          class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 font-medium shadow-sm active:scale-95">
          <Plus class="h-4 w-4" /> Add Expense
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-border mb-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button @click="activeTab = 'recurring'" :class="[
            activeTab === 'recurring'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/50',
            'whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-all duration-200 cursor-pointer'
          ]">
            Recurring & Budgets
          </button>
          <button @click="activeTab = 'log'" :class="[
            activeTab === 'log'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/50',
            'whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-all duration-200 cursor-pointer'
          ]">
            Expenses Log
          </button>
        </nav>
      </div>

      <!-- Tab 1: Expenses Log -->
      <div v-if="activeTab === 'log'" class="space-y-6">
        <!-- Filters -->
        <div class="bg-card border border-border p-4 rounded-lg shadow-sm">
          <div class="flex flex-wrap gap-4">
            <select v-model="selectedCategory"
              class="border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none cursor-pointer">
              <option>All Categories</option>
              <option>🏠 Housing</option>
              <option>🍽️ Food & Dining</option>
              <option>⚡ Utilities</option>
              <option>🚗 Transportation</option>
              <option>🛡️ Insurance</option>
            </select>
            <select v-model="selectedTimeframe"
              class="border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none cursor-pointer">
              <option>All Time</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
        </div>

        <!-- Expenses List Card -->
        <div class="bg-card border border-border rounded-lg shadow-sm">
          <!-- Card Header with Fun Search Bar -->
          <div class="p-6 border-b border-border flex justify-between items-center">
            <h2 class="text-lg font-semibold text-card-foreground">Recent Expenses</h2>

            <!-- Fun Expandable Search Bar -->
            <div class="relative flex items-center h-10">
              <div
                class="flex items-center bg-muted/40 border border-border rounded-full transition-all duration-300 ease-in-out overflow-hidden"
                :class="isSearchExpanded ? 'w-64 px-3 h-9 bg-card border-primary/50' : 'w-9 h-9 justify-center cursor-pointer hover:bg-muted/70 hover:border-foreground/20'"
                @click="!isSearchExpanded && expandSearch()">
                <Search class="h-4 w-4 text-muted-foreground shrink-0" />

                <input v-show="isSearchExpanded" ref="searchInputRef" type="text" v-model="searchQuery"
                  placeholder="Search expenses..."
                  class="ml-2 w-full bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  @keydown.esc="retractSearch" @click.stop />

                <button v-if="isSearchExpanded" @click.stop="retractSearch"
                  class="ml-1 p-0.5 hover:bg-muted rounded-full transition-colors shrink-0 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer">
                  <ChevronRight class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- List Body -->
          <div class="divide-y divide-border">
            <div v-for="expense in filteredExpenses" :key="expense.id"
              class="p-6 flex justify-between items-center hover:bg-muted/10 transition-colors">
              <div class="flex items-center">
                <span class="text-2xl mr-4">{{ expense.emoji }}</span>
                <div>
                  <h3 class="font-medium text-card-foreground">{{ expense.title }}</h3>
                  <p class="text-sm text-muted-foreground">{{ expense.date }} • {{ expense.category }}</p>
                  <p class="text-sm text-muted-foreground/80 mt-0.5">{{ expense.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-lg text-red-600 dark:text-red-400">
                  -${{ Math.abs(expense.amount).toFixed(2) }}
                </p>
                <button @click="editExpense(expense)"
                  class="text-sm text-primary hover:text-primary/80 cursor-pointer">Edit</button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredExpenses.length === 0" class="p-12 text-center text-muted-foreground">
              No expenses match your search or filters.
            </div>
          </div>

          <!-- Load More -->
          <div v-if="filteredExpenses.length > 0" class="p-6 text-center border-t border-border">
            <button class="text-primary hover:text-primary/80 font-medium cursor-pointer">Load More Expenses</button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Recurring & Budgets -->
      <div v-else-if="activeTab === 'recurring'" class="space-y-6">

        <!-- Section 1: Base Budget Types (Collapsible) -->
        <div class="bg-card border border-border rounded-lg shadow-sm">
          <div @click="isBaseExpanded = !isBaseExpanded"
            class="p-6 border-b border-border flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition-colors">
            <h2 class="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <span>📊</span> Base Budgets
            </h2>
            <div class="flex items-center gap-4" @click.stop>
              <!-- Fun Expandable Search Bar for Base Budgets -->
              <div class="relative flex items-center h-10">
                <div 
                  class="flex items-center bg-muted/40 border border-border rounded-full transition-all duration-300 ease-in-out overflow-hidden"
                  :class="isBaseSearchExpanded ? 'w-64 px-3 h-9 bg-card border-primary/50' : 'w-9 h-9 justify-center cursor-pointer hover:bg-muted/70 hover:border-foreground/20'"
                  @click="!isBaseSearchExpanded && expandBaseSearch()"
                >
                  <Search class="h-4 w-4 text-muted-foreground shrink-0" />
                  
                  <input 
                    v-show="isBaseSearchExpanded"
                    ref="baseSearchInputRef"
                    type="text" 
                    v-model="baseSearchQuery"
                    placeholder="Search budgets..."
                    class="ml-2 w-full bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    @keydown.esc="retractBaseSearch"
                    @click.stop
                  />
                  
                  <button 
                    v-if="isBaseSearchExpanded"
                    @click.stop="retractBaseSearch"
                    class="ml-1 p-0.5 hover:bg-muted rounded-full transition-colors shrink-0 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button 
                v-if="!showAddBaseForm" 
                @click="openAddBaseForm" 
                class="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus class="h-3.5 w-3.5" /> Add Base
              </button>
              <ChevronDown class="h-5 w-5 text-muted-foreground transition-transform duration-200"
                :class="{ 'rotate-180': isBaseExpanded }" @click="isBaseExpanded = !isBaseExpanded" />
            </div>
          </div>

          <div v-show="isBaseExpanded" class="divide-y divide-border">
            
            <!-- Inline Create Base Budget Form -->
            <div v-if="showAddBaseForm" class="p-6 bg-muted/10">
              <form @submit.prevent="submitAddBaseForm" class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wider">New Base Budget</h3>
                  <button type="button" @click="closeAddBaseForm" class="text-muted-foreground hover:text-foreground">
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-muted-foreground mb-1">CATEGORY NAME</label>
                    <input 
                      type="text" 
                      v-model="newBase.category"
                      placeholder="e.g. Shopping, Entertainment"
                      class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-muted-foreground mb-1">MONTHLY AMOUNT ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      v-model="newBase.amount"
                      placeholder="0.00"
                      class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                      required
                      min="0.01"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-muted-foreground mb-1">EMOJI</label>
                    <input 
                      type="text" 
                      v-model="newBase.emoji"
                      placeholder="e.g. 🛍️"
                      class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div class="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    @click="closeAddBaseForm"
                    class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>Create Base Budget</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Base Budget List Items -->
            <div v-for="item in filteredBaseBudgets" :key="item.id">
              
              <!-- Inline Edit Form for Base Budget -->
              <div v-if="editingBaseId === item.id" class="p-6 bg-muted/10">
                <form @submit.prevent="submitEditBaseForm(item.id)" class="space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Edit Base Budget</h3>
                    <button type="button" @click="cancelEditingBase" class="text-muted-foreground hover:text-foreground">
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-muted-foreground mb-1">CATEGORY NAME</label>
                      <input 
                        type="text" 
                        v-model="editBaseData.category"
                        class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-muted-foreground mb-1">MONTHLY AMOUNT ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        v-model="editBaseData.amount"
                        class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                        required
                        min="0.01"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-muted-foreground mb-1">EMOJI</label>
                      <input 
                        type="text" 
                        v-model="editBaseData.emoji"
                        class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div class="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      @click="cancelEditingBase"
                      class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Normal Row View for Base Budget -->
              <div v-else class="p-6 flex justify-between items-center hover:bg-muted/10 transition-colors">
                <div class="flex items-center">
                  <span class="text-2xl mr-4">{{ item.emoji }}</span>
                  <div>
                    <h3 class="font-medium text-card-foreground">{{ item.category }}</h3>
                    <p class="text-sm text-muted-foreground">{{ item.description }}</p>
                  </div>
                </div>
                <div class="text-right flex flex-col items-end gap-2">
                  <p class="font-semibold text-lg text-foreground">${{ item.amount.toFixed(2) }}</p>
                  <div class="flex gap-2">
                    <button 
                      @click="startEditingBase(item)" 
                      class="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 cursor-pointer"
                    >
                      <Pencil class="h-3 w-3" /> Edit
                    </button>
                    <button 
                      @click="deleteBaseBudget(item.id)" 
                      class="text-xs text-destructive hover:text-destructive/80 font-medium flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 class="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State for Base Budgets -->
            <div v-if="filteredBaseBudgets.length === 0" class="p-12 text-center text-muted-foreground">
              No base budgets found. Click "+ Add Base" to create one.
            </div>

          </div>
        </div>

        <!-- Section 2: Custom Recurring Expenses (Collapsible) -->
        <div class="bg-card border border-border rounded-lg shadow-sm">
          <div @click="isCustomExpanded = !isCustomExpanded"
            class="p-6 border-b border-border flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition-colors">
            <h2 class="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <span>💳</span> Custom Subscriptions (Recurring)
            </h2>
            <div class="flex items-center gap-4" @click.stop>
              <!-- Fun Expandable Search Bar for Custom Subscriptions -->
              <div class="relative flex items-center h-10">
                <div
                  class="flex items-center bg-muted/40 border border-border rounded-full transition-all duration-300 ease-in-out overflow-hidden"
                  :class="isCustomSearchExpanded ? 'w-64 px-3 h-9 bg-card border-primary/50' : 'w-9 h-9 justify-center cursor-pointer hover:bg-muted/70 hover:border-foreground/20'"
                  @click="!isCustomSearchExpanded && expandCustomSearch()">
                  <Search class="h-4 w-4 text-muted-foreground shrink-0" />

                  <input v-show="isCustomSearchExpanded" ref="customSearchInputRef" type="text"
                    v-model="customSearchQuery" placeholder="Search subscriptions..."
                    class="ml-2 w-full bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    @keydown.esc="retractCustomSearch" @click.stop />

                  <button v-if="isCustomSearchExpanded" @click.stop="retractCustomSearch"
                    class="ml-1 p-0.5 hover:bg-muted rounded-full transition-colors shrink-0 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer">
                    <ChevronRight class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button v-if="!showAddForm" @click="openAddForm"
                class="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium cursor-pointer">
                <Plus class="h-3.5 w-3.5" /> Add Custom
              </button>
              <ChevronDown class="h-5 w-5 text-muted-foreground transition-transform duration-200"
                :class="{ 'rotate-180': isCustomExpanded }" @click="isCustomExpanded = !isCustomExpanded" />
            </div>
          </div>

          <div v-show="isCustomExpanded" class="divide-y divide-border">

            <!-- Inline Create Form -->
            <div v-if="showAddForm" class="p-6 bg-muted/10">
              <form @submit.prevent="submitAddForm" class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wider">New Monthly
                    Subscription</h3>
                  <button type="button" @click="closeAddForm" class="text-muted-foreground hover:text-foreground">
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-muted-foreground mb-1">NAME</label>
                    <input ref="addNameInputRef" type="text" v-model="newRecurring.recurring_name"
                      placeholder="e.g. Netflix, Spotify"
                      class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                      required />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-muted-foreground mb-1">MONTHLY AMOUNT ($)</label>
                    <input type="number" step="0.01" v-model="newRecurring.amount" placeholder="0.00"
                      class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                      required min="0.01" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-muted-foreground mb-1">RECURRING DATE (MM/DD)</label>
                    <input type="text" v-model="newRecurringDateInput" @input="onDateInput($event, 'create')"
                      placeholder="MM/DD" maxlength="5"
                      class="w-28 border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                      required />
                  </div>
                  <div class="flex items-center md:pt-6">
                    <label class="flex items-center cursor-pointer select-none">
                      <input type="checkbox" v-model="newRecurring.active"
                        class="rounded border-input text-primary bg-card focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer" />
                      <span class="ml-2 text-sm text-foreground font-medium">Mark as Active</span>
                    </label>
                  </div>
                </div>
                <div class="flex justify-end gap-3 pt-2">
                  <button type="button" @click="closeAddForm"
                    class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit"
                    class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    :disabled="isSubmitting">
                    <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                    <span>Create Subscription</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Recurring List Items -->
            <div v-for="item in filteredCustomRecurringList" :key="item.id">

              <!-- Inline Edit Form -->
              <div v-if="editingId === item.id" class="p-6 bg-muted/10">
                <form @submit.prevent="submitEditForm(item.id)" class="space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Edit Subscription
                    </h3>
                    <button type="button" @click="cancelEditingRecurring"
                      class="text-muted-foreground hover:text-foreground">
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-muted-foreground mb-1">NAME</label>
                      <input ref="editNameInputRef" type="text" v-model="editRecurringData.recurring_name"
                        class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                        required />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-muted-foreground mb-1">MONTHLY AMOUNT ($)</label>
                      <input type="number" step="0.01" v-model="editRecurringData.amount"
                        class="w-full border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                        required min="0.01" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-muted-foreground mb-1">RECURRING DATE
                        (MM/DD)</label>
                      <input type="text" v-model="editRecurringDateInput" @input="onDateInput($event, 'edit')"
                        placeholder="MM/DD" maxlength="5"
                        class="w-28 border border-input bg-card text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                        required />
                    </div>
                    <div class="flex items-center md:pt-6">
                      <label class="flex items-center cursor-pointer select-none">
                        <input type="checkbox" v-model="editRecurringData.active"
                          class="rounded border-input text-primary bg-card focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer" />
                        <span class="ml-2 text-sm text-foreground font-medium">Mark as Active</span>
                      </label>
                    </div>
                  </div>
                  <div class="flex justify-end gap-3 pt-2">
                    <button type="button" @click="cancelEditingRecurring"
                      class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit"
                      class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      :disabled="isSubmitting">
                      <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Normal Row View -->
              <div v-else class="p-6 flex justify-between items-center hover:bg-muted/10 transition-colors">
                <div class="flex items-center">
                  <span class="text-2xl mr-4">💳</span>
                  <div>
                    <h3 class="font-medium text-card-foreground">{{ item.recurring_name }}</h3>
                    <p class="text-sm text-muted-foreground">Renewal: {{ formatDate(item.recurring_date) }}</p>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1.5 transition-all duration-200"
                      :class="item.active ? 'bg-green-500/10 text-green-600 dark:bg-green-900/30 dark:text-green-300' : 'bg-muted text-muted-foreground'">
                      {{ item.active ? 'Active' : 'Paused' }}
                    </span>
                  </div>
                </div>
                <div class="text-right flex flex-col items-end gap-2">
                  <p class="font-semibold text-lg text-foreground">${{ item.amount.toFixed(2) }}</p>
                  <div class="flex gap-2">
                    <button @click="startEditingRecurring(item)"
                      class="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 cursor-pointer">
                      <Pencil class="h-3 w-3" /> Edit
                    </button>
                    <button @click="startDeleteRecurring(item)"
                      class="text-xs text-destructive hover:text-destructive/80 font-medium flex items-center gap-0.5 cursor-pointer">
                      <Trash2 class="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State for Custom -->
            <div v-if="filteredCustomRecurringList.length === 0" class="p-12 text-center text-muted-foreground">
              No custom monthly subscriptions defined. Click "+ Add Custom" to get started.
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Confirm Delete Modal -->
    <Dialog :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="text-destructive flex items-center gap-2">
            ⚠️ Delete Subscription
          </DialogTitle>
          <div class="mt-3 text-sm text-muted-foreground">
            Are you sure you want to delete the subscription <span class="font-semibold text-foreground">"{{ subscriptionToDelete?.recurring_name }}"</span>? This action cannot be undone.
          </div>
        </DialogHeader>
        <DialogFooter class="flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            @click="closeDeleteModal"
            class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors cursor-pointer"
            :disabled="isDeleteSubmitting"
          >
            Cancel
          </button>
          <button 
            type="button"
            @click="confirmDeleteRecurring"
            class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            :disabled="isDeleteSubmitting"
          >
            <Loader2 v-if="isDeleteSubmitting" class="h-4 w-4 animate-spin" />
            <span>Delete</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Alert Toast Banner -->
    <Transition enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="alertMessage"
        class="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-card border rounded-lg shadow-lg p-4 flex items-center justify-between"
        :class="alertType === 'success' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'">
        <div class="flex items-center">
          <span class="text-xl mr-3">{{ alertType === 'success' ? '✅' : '❌' }}</span>
          <p class="text-sm font-medium text-foreground">{{ alertMessage }}</p>
        </div>
        <button @click="alertMessage = ''" class="text-muted-foreground hover:text-foreground">
          <X class="h-4 w-4" />
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { useExpensesView } from '@/features/transactions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-vue-next';

const {
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
  filteredExpenses,
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
  filteredCustomRecurringList,
  alertMessage,
  alertType,
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
} = useExpensesView();
</script>