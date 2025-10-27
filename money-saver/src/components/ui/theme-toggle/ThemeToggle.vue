<template>
    <Button variant="ghost" size="icon" @click="toggleTheme" class="h-9 w-9">
        <!-- Sun icon for light mode -->
        <svg v-if="resolvedTheme === 'light'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="transition-transform duration-200 rotate-0 scale-100">
            <circle cx="12" cy="12" r="4" />
            <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        <!-- Moon icon for dark mode -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="transition-transform duration-200 rotate-0 scale-100">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useTheme } from '@/composables/useTheme';

const { resolvedTheme, toggleTheme } = useTheme()
</script>