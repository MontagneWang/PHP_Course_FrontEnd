<script lang="ts" setup>

</script>

<template>
	<div class="navbar">
		<nav>
			<router-link to="/">首页</router-link>
			|
			<router-link to="/login">登录</router-link>
			|
			<router-link to="/backend">后台</router-link>
		</nav>
	</div>

</template>
<style lang="scss" scoped>
.navbar {
	nav {
		position: relative;
		top: 0;
		left: 0;
		width: 100vw;
		height: 2em;
		margin: 0 auto;
		line-height: 2em;
		background-color: rgba(255, 255, 255, 1);
		border: 1px solid rgba(218, 218, 218, 1);
		box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.15);
		z-index: 2;
		text-align: center;
		font-size: 2em;

		a {
			font-weight: bold;
			text-decoration: none;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
}

</style>
