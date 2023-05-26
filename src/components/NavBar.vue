<script lang="ts" setup>

</script>

<template>
	<div class="navbar">
		<!--底部切换路由-->
		<!--		这里是 navbar 组件-->
		<!--		<keep-alive>-->
		<router-view/>
		<!--		</keep-alive>-->
		<nav>
			<router-link to="/">首页</router-link>
			&emsp;|&emsp;
			<router-link to="/about">我的</router-link>
		</nav>
	</div>

</template>
<style lang="scss" scoped>
.navbar {
	nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 6.8vh;
		margin: 0 auto;
		line-height: 6.8vh;
		background-color: rgba(255, 255, 255, 1);
		border: 1px solid rgba(218, 218, 218, 1);
		box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.15);
		z-index: 2;
	}
}

nav {
	a {
		font-weight: bold;
		text-decoration: none;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
