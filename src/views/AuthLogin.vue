<script lang="ts" setup>
import {ref} from "vue";
import axios from "../api/axios";

let currentTab = ref(0);
let username = ref('');
let password = ref('');
let passwordConfirm = ref('');
let isLogin = ref(false);
let data = ref([]);

function changeTab(tab) {
	currentTab.value = tab;
}

// fixme 需要解决通过 post 发送请求（目前后端收不到 post 数据）
async function handleSubmit() {
	let {data: response} = await axios.post(`/FinalTerm/AuthLogin.php`,{
		identity: currentTab.value,
		username: username.value,
		password: password.value
	});
	data.value = response
}
// async function handleSubmit() {
// 	let {data: response} = await axios.get(`/FinalTerm/AuthLogin.php?identity=${currentTab.value}&username=${username.value}&password=${password.value}`)
// 	data.value = response
// 	console.log(data.value)
// 	// todo 登录成功则路由放行
// }
</script>

<template>
	<div class="login">
		<div class="tabs">
			<span>请选择您的登录身份：</span>
			<button :class="{ active: currentTab === 0 }" @click="changeTab(0)">人才用户</button>
			<button :class="{ active: currentTab === 1 }" @click="changeTab(1)">公司企业</button>
			<button :class="{ active: currentTab === 2 }" @click="changeTab(2)">平台管理员</button>
		</div>

		<form @submit.prevent="handleSubmit">
			<!-- 根据 isLogin 改变标题和按钮文本 -->
			<br>
			<br>
			<div>
				<label>&emsp;用户名：
					<input v-model.trim="username" required type="text"/>
				</label>
			</div>
			<br>
			<div>
				<label>&emsp;&emsp;密码：
					<input v-model.trim="password" required type="password"/>
				</label>
			</div>

			<!-- 只有在注册模式下才显示确认密码输入框 -->
			<div v-if="!isLogin">
				<br>
				<label>确认密码：
					<input v-model.trim="passwordConfirm" required type="password"/>
				</label>
			</div>
			<br>

			<div class="foot-button">
				<button type="submit">点击{{ isLogin ? '登录' : '注册' }}</button>
				<button @click="isLogin=!isLogin">切换到 {{ isLogin ? '注册' : '登录' }}</button>
			</div>
		</form>
	</div>
</template>

<style lang="scss" scoped>
.login {
	width: 50vw;
	margin: 0 auto;

	.tabs {
		margin-top: 20vh;
		text-align: center;

		button {
			width: 100px;
			height: 50px;
			margin-right: 30px;
		}
	}


	form {
		width: 45%;
		margin: 0 auto;
		text-align: center;

		.foot-button {
			button {
				margin-right: 20px;
			}
		}
	}
}


.active {
	color: blue;
}

</style>
