<script lang="ts" setup>
import NavBar from "./components/NavBar.vue";
</script>

<template>
	<nav-bar/>
	<router-view v-slot="{ Component }">
		<keep-alive>
			<component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
		</keep-alive>
		<component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name"/>
	</router-view>
</template>

<style scoped>
html *
{
	font-family: LXGW WenKai Lite, serif !important;
}
</style>
