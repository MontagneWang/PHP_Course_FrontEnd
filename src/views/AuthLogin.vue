<script lang="ts" setup>
import {computed, onMounted, ref, watchEffect} from "vue";
import axios from "../api/axios";
import Modal from '../utils/ToastComp.vue'
import {useRouter} from 'vue-router'
import {useCounterStore} from '../stores'

const store = useCounterStore()
const {POST_CONFIG: config} = store
const router = useRouter()
const showModal = ref(false)
let toastText = ref('')
let currentTab = ref(0);
let username = ref('');
let password = ref('');
let passwordConfirm = ref('');
let isLogin = ref(true);
let data = ref({});
// 用于表单传参
let signup1 = ref('')
let signup2 = ref('')
let signup3 = ref('')
let signup4 = ref('')
let signup5 = ref('')
let signup6 = ref('')
let signup7 = ref('')

watchEffect(() => {
	currentTab.value = Number(router.currentRoute.value.query.identity)
})

function changeTab(tab) {
	currentTab.value = tab;
}

async function handleSubmit() {
	if (!isLogin.value) {
		if (passwordConfirm.value !== password.value) {
			toastText.value = '两次输入的密码不一致，请重新输入'
			showModal.value = true
			password.value = ''
			passwordConfirm.value = ''
			return
		}
	}
	let {data: response} = await axios.post(`/FinalTerm/AuthLogin.php`, {
		isLogin: isLogin.value,
		identity: currentTab.value,
		username: username.value,
		password: password.value,
		signup1:signup1.value,
		signup2:signup2.value,
		signup3:signup3.value,
		signup4:signup4.value,
		signup5:signup5.value,
		signup6:signup6.value,
		signup7:signup7.value
	}, config);
	data.value = response
	switch (data.value.code) {
		case '20001':
			store.userId = data.value.data.id
			store.userInfo.identity = data.value.data.identity
			store.userInfo.record = data.value.data.record
			store.userInfo.resume = data.value.data.resume
			store.userInfo.starCompany = data.value.data.starCompany.split(',')
			store.userInfo.starPositions = data.value.data.starPositions.split(',')
			store.userInfo.auditStatus = data.value.data.auditStatus

			switch (data.value.data.identity) {
				case '0':
					username.value = ''
					password.value = ''
					store.LoginIdentity = 0
					await router.push('/user')
					break
				case '1':
					username.value = ''
					password.value = ''
					store.LoginIdentity = 1
					await router.push('/company')
					break
				case '2':
					username.value = ''
					password.value = ''
					store.LoginIdentity = 2
					await router.push('/backend')
					break
			}
			break
		case '20101':
			store.userId = data.value.data.id
			store.userInfo.identity = data.value.data.identity
			store.userInfo.auditStatus='0'
			switch (data.value.data.identity) {
				case '0':
					username.value = ''
					password.value = ''
					store.LoginIdentity = 0
					await router.push('/user')
					break
				case '1':
					username.value = ''
					password.value = ''
					store.LoginIdentity = 1
					await router.push('/company')
					break
			}
			break
		case '40101':
			toastText.value = '请检查您的用户名或密码，并保证没有选错登录类型'
			showModal.value = true
			break
		case '40201':
			toastText.value = '用户名已存在，请更换'
			showModal.value = true
			break
	}
}
</script>

<template>
	<Teleport to="body">
		<!-- 使用这个 modal 组件，传入 prop -->
		<modal :show="showModal" @close="showModal = false">
			<template #header>
				<h3>{{ isLogin ? '登陆' : '注册' }}失败</h3>
			</template>
			<template #body>
				{{ toastText }}
			</template>
		</modal>
	</Teleport>

	<div class="login" :style="{marginTop:isLogin?'20vh':'5vh'}">
		<div class="tabs">
			<span>请选择您的{{ isLogin?'登录':'注册' }}身份：</span>
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

			<!-- 只有在用户注册才显示 -->
			<template  v-if="!isLogin&&currentTab===0">
			<div>
				<br>
				<label>确认密码：
					<input v-model.trim="passwordConfirm" required type="password"/>
				</label>
			</div>
			<hr>

			<div >
				<label>&emsp;&emsp;姓名：
					<input v-model.trim="signup1" required type="text"/>
				</label>
			</div>
			<br>
			<div >
				<label>求职类型：
					<input v-model.trim="signup2" required type="text"/>
				</label>
			</div>
			<br>
			<div >
				<label>&emsp;&emsp;年龄：
					<input v-model.trim="signup3" required type="text"/>
				</label>
			</div>
			<br>
			<div >
				<label>&emsp;&emsp;籍贯：
					<input v-model.trim="signup4" required type="text"/>
				</label>
			</div>
			<br>
			<div >
				<label>&emsp;&emsp;学历：
					<input v-model.trim="signup5" required type="text"/>
				</label>
			</div>
			<br>
			<div >
				<label>&emsp;&emsp;简历：
					<input v-model.trim="signup6" required type="text"/>
				</label>
			</div>
			<br>
			<div >
				<label>联系方式：
					<input v-model.trim="signup7" required type="text"/>
				</label>
			</div>
			</template>

			<!-- 只有在公司注册才显示 -->
			<template  v-if="!isLogin&&currentTab===1">
				<div>
					<br>
					<label>确认密码：
						<input v-model.trim="passwordConfirm" required type="password"/>
					</label>
				</div>
				<hr>

				<div >
					<label>所属行业：
						<input v-model.trim="signup1" required type="text"/>
					</label>
				</div>
				<br>
				<div >
					<label>&emsp;&emsp;名称：
						<input v-model.trim="signup2" required type="text"/>
					</label>
				</div>
				<br>
				<div >
					<label>&emsp;&emsp;地址：
						<input v-model.trim="signup3" required type="text"/>
					</label>
				</div>
				<br>
				<div >
					<label>&emsp;&emsp;法人：
						<input v-model.trim="signup4" required type="text"/>
					</label>
				</div>
				<br>
				<div >
					<label>注册资本：
						<input v-model.trim="signup5" required type="text"/>
					</label>
				</div>
				<br>
				<div >
					<label>其他介绍：
						<input v-model.trim="signup6" required type="text"/>
					</label>
				</div>
				<br>
				<div >
					<label>联系方式：
						<input v-model.trim="signup7" required type="text"/>
					</label>
				</div>
			</template>
			<br>

			<div class="foot-button">
				<button type="submit">点击{{ isLogin ? '登录' : '注册' }}</button>
				<button @click.prevent="isLogin=!isLogin">切换到 {{ isLogin ? '注册' : '登录' }}</button>
			</div>
			<br>
			<br>
		</form>
	</div>
</template>

<style lang="scss" scoped>
.login {
	width: 50vw;
	margin: 0 auto;

	.tabs {
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
