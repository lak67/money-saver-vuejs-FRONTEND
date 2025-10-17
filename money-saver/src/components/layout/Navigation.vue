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
                    <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
                        class="px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="isActive(link.path)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'">
                        {{ link.name }}
                    </router-link>

                    <!-- Theme Toggle -->
                    <div class="ml-4 pl-4 border-l border-border">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRoute } from 'vue-router'

const route = useRoute()

const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Budget', path: '/budget' },
    { name: 'Settings', path: '/settings' }
]

const isActive = (path: string) => {
    return route.path === path
}
</script>