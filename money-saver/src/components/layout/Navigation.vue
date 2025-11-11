<template>
    <nav class="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <router-link to="/" class="text-xl font-bold text-foreground hover:text-primary transition-colors">
                        💰 Money Saver
                    </router-link>
                </div>
                <div class="flex items-center space-x-1">
                    <!-- Navigation Links - Show only when authenticated -->
                    <template v-if="isAuthenticated">
                        <router-link v-for="link in authNavLinks" :key="link.path" :to="link.path"
                            class="px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="isActive(link.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'">
                            {{ link.name }}
                        </router-link>
                    </template>

                    <!-- Public Navigation Links - Show only when not authenticated -->
                    <template v-if="!isAuthenticated">
                        <router-link v-for="link in publicNavLinks" :key="link.path" :to="link.path"
                            class="px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="isActive(link.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'">
                            {{ link.name }}
                        </router-link>
                    </template>

                    <!-- Authentication Section -->
                    <div class="ml-4 pl-4 border-l border-border flex items-center space-x-2">
                        <!-- Unauthenticated State -->
                        <template v-if="!isAuthenticated">
                            <RegisterModal />
                            <router-link to="/login"
                                class="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                Login
                            </router-link>
                        </template>

                        <!-- Authenticated State -->
                        <template v-if="isAuthenticated">
                            <!-- User Dropdown -->
                            <div class="relative" ref="dropdownRef">
                                <button @click="toggleDropdown"
                                    class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
                                        {{ userInitials }}
                                    </div>
                                    <span>{{ userFullName }}</span>
                                    <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showDropdown }"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="m19 9-7 7-7-7"></path>
                                    </svg>
                                </button>

                                <!-- Dropdown Menu -->
                                <div v-show="showDropdown"
                                    class="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                                    <div class="py-1">
                                        <router-link to="/profile" @click="closeDropdown"
                                            class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                                </path>
                                            </svg>
                                            Edit Profile
                                        </router-link>
                                        <router-link to="/settings" @click="closeDropdown"
                                            class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                                </path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Settings
                                        </router-link>
                                        <hr class="border-border">
                                        <button @click="handleLogout"
                                            class="w-full flex items-center px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors">
                                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                                </path>
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- Theme Toggle -->
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import RegisterModal from '@/components/ui/register-modal/RegisterModal.vue'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const dropdownRef = ref<HTMLElement | null>(null)
const showDropdown = ref(false)

// Computed properties for auth state
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const userFullName = computed(() => store.getters['auth/userFullName'] || 'User')
const userFirstName = computed(() => store.getters['auth/userFirstName'] || '')
const userLastName = computed(() => store.getters['auth/userLastName'] || '')

// User initials for avatar
const userInitials = computed(() => {
    const first = userFirstName.value.charAt(0).toUpperCase()
    const last = userLastName.value.charAt(0).toUpperCase()
    return first + last || 'U'
})

// Navigation links for authenticated users
const authNavLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Budget', path: '/budget' }
]

// Navigation links for public (non-authenticated) users
const publicNavLinks = [
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' }
]

const isActive = (path: string) => {
    return route.path === path
}

// Dropdown methods
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
    showDropdown.value = false
}

// Handle logout
const handleLogout = async () => {
    try {
        await store.dispatch('auth/logout')
        closeDropdown()
        router.push('/')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}

// Handle click outside dropdown
const handleClickOutside = (event: Event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        closeDropdown()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>