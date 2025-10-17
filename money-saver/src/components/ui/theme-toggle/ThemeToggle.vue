<template>
    <Button variant="ghost" size="icon" @click="toggleTheme" class="relative h-9 w-9"
        :title="`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`">
        <!-- Sun icon for light mode -->
        <svg v-if="resolvedTheme === 'light'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="transition-all">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M6.34 17.66l-1.41 1.41" />
            <path d="M19.07 4.93l-1.41 1.41" />
        </svg>

        <!-- Moon icon for dark mode -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="transition-all">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>

        <!-- System indicator dot -->
        <span v-if="theme === 'system'"
            class="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
    </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useTheme } from '@/composables/useTheme';

const { theme, resolvedTheme, toggleTheme } = useTheme()
</script>