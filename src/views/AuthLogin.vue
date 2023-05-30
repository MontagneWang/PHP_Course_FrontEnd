<script lang="ts" setup>
import {ref, watchEffect} from "vue";
import axios from "../api/axios";
import Modal from '../utils/ToastComp.vue'
import {useRouter} from 'vue-router'
import {useCounterStore} from '../stores'

const store = useCounterStore()
const router = useRouter()
const showModal = ref(false)
let currentTab = ref(0);
let username = ref('');
let password = ref('');
let passwordConfirm = ref('');
let isLogin = ref(false);
let data = ref({});
const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
};

function changeTab(tab) {
	currentTab.value = tab;
}

// todo 登录成功则路由放行
async function handleSubmit() {
	let {data: response} = await axios.post(`/FinalTerm/AuthLogin.php`, {
		identity: currentTab.value,
		username: username.value,
		password: password.value
	}, config);
	data.value = response
	if (data.value.code === '20001') {
		switch (data.value.data.identity) {
			case '0':
				store.LoginIdentity = 0
				await router.push('/user')
				break
			case '1':
				store.LoginIdentity = 1
				await router.push('/company')
				break
			case '2':
				store.LoginIdentity = 2
				await router.push('/backend')
				break
		}
	} else if (data.value.code === '40101') {
		showModal.value = true
	}
}
</script>

<template>
	<Teleport to="body">
		<!-- 使用这个 modal 组件，传入 prop -->
		<modal :show="showModal" @close="showModal = false">
			<template #header>
				<h3>登陆失败</h3>
			</template>
			<template #body>
				请检查您的用户名或密码，并保证没有选错登录类型
			</template>
		</modal>
	</Teleport>

	<div class="login">
		<div class="tabs">
			<span>请选择您的登录身份：</span>
			<button :class="{ active: currentTab === 0 }"
			        @click="changeTab(0)">人才用户
			</button>
			<button :class="{ active: currentTab === 1 }"
			        @click="changeTab(1)">公司企业
			</button>
			<button v-show="isLogin"
			        :class="{ active: currentTab === 2 }"
			        @click="changeTab(2)">平台管理员
			</button>
		</div>

		<form @submit.prevent="handleSubmit">
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
