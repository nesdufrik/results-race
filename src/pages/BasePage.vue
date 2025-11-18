<script setup>
import MenuBar from '@/components/MenuBar.vue'
</script>
<template>
	<div class="min-h-screen">
		<MenuBar />
		<main class="container mx-auto px-4 py-8">
			<RouterView />
		</main>
	</div>
</template>
