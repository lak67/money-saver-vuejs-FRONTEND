<template>
    <div class="min-h-screen bg-background flex items-center justify-center">
        <div class="text-center">
            <div class="text-6xl mb-4">🔍</div>
            <h1 class="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
            <p class="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
            <router-link to="/"
                class="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Go Back Home
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
// 404 page logic
</script>