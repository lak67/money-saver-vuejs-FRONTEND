<script setup lang="ts">
import Navigation from '@/components/layout/Navigation.vue';
import { useTheme } from '@/composables/useTheme';

// Initialize theme system
const { } = useTheme()
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Global Navigation -->
    <Navigation />

    <!-- Main Content Area -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
