<template>
    <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-muted-foreground">Theme:</span>
        <div class="flex rounded-md border border-border bg-background">
            <Button v-for="option in themeOptions" :key="option.value"
                :variant="theme === option.value ? 'default' : 'ghost'" size="sm"
                class="rounded-none first:rounded-l-md last:rounded-r-md border-none" @click="setTheme(option.value)">
                <component :is="option.icon" class="h-4 w-4 mr-2" />
                {{ option.label }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useTheme, type Theme } from '@/composables/useTheme'

const { theme, setTheme } = useTheme()

// Theme options with icons
const themeOptions = [
    {
        value: 'light' as Theme,
        label: 'Light',
        icon: {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      `
        }
    },
    {
        value: 'dark' as Theme,
        label: 'Dark',
        icon: {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      `
        }
    },
    {
        value: 'system' as Theme,
        label: 'System',
        icon: {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      `
        }
    }
]
</script>