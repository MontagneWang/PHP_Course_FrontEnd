<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import axios from "../api/axios";
import {useCounterStore} from '../stores'
import Modal from '../utils/ToastComp.vue'

const store = useCounterStore()
const {POST_CONFIG: config} = store
const showModal = ref(false)

let formData = reactive({
	name: '',
	peopleNum: 1,
	time: '2023-05-31',
	require: '',
	salary: '',
	subsidy: 0,
	tel: '',
})
let responseData = reactive({
	code: '',
	message: '',
	status: ''
})
let headText = ''
let bodyText = ''
let data = ref([])
onMounted(async () => {
	let {data: response} = await axios.get('/FinalTerm/getTalentsData.php');
	data.value = response
})
async function handleSubmit() {
	if (!formData.name || !formData.require || !formData.tel || !formData.salary) {
		headText = '发布内容不能有空项'
		bodyText = '请检查是否所有选项都已填写，并且待遇需要为正数'
		showModal.value = true
		return
	}
	let {data: response} = await axios.post(`/FinalTerm/publishPositions.php`, {
		formData,
	}, config);
	responseData = response
	if (responseData.code === '20301') {
		headText = '职位已成功发布'
		bodyText = '您发布的职位将在后台审核通过后展示在首页'
		showModal.value = true
		formData.name = ''
		formData.peopleNum = 1
		formData.time = '2023-05-31'
		formData.require = ''
		formData.salary = ''
		formData.subsidy = 0
		formData.tel = ''
	}
}

</script>

<template>
	<Teleport to="body">
		<!-- 使用这个 modal 组件，传入 prop -->
		<modal :show="showModal" @close="showModal = false">
			<template #header>
				<h3>{{ headText }}</h3>
			</template>
			<template #body>
				<span>{{ bodyText }}</span>
			</template>
		</modal>
	</Teleport>

	<h1>企业信息</h1>
	<div class="container border">
		<div class="left border">
			<div class="record">
				<h3>&emsp;应聘者记录：</h3>
				<table>
					<thead>
					<tr>
						<th style="width: 2em">删除</th>
						<th style="width: 2em">姓名</th>
						<th>求职类型</th>
						<th style="width: 2em">年龄</th>
						<th style="width: 3em">籍贯</th>
						<th style="width: 2em">学历</th>
						<th>简历</th>
						<th>联系方式</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) in data" :key="index">
						<template v-if="store.userInfo.record.includes(item.id)">
							<td style="text-align: center"><input type="checkbox"></td>
							<td>{{ item.name }}</td>
							<td>{{ item.job_type }}</td>
							<td>{{ item.age }}</td>
							<td>{{ item.native_place }}</td>
							<td style="text-align: right;">{{ item.education }}</td>
							<td>{{ item.resume }}</td>
							<td style="text-align: right;">{{ item.contact }}</td>
						</template>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="pub ">
			<h3>发布新职位</h3>
			<form>
				<label for="name">名称：</label>
				<input id="name"
				       v-model="formData.name"
				       name="name"
				       placeholder="请输入职位名称"
				       required
				       type="text"><br><br>
				<label for="peopleNum">人数：</label>
				<input id="peopleNum"
				       v-model="formData.peopleNum"
				       min="1"
				       name="peopleNum"
				       placeholder="请输入职位所需人数"
				       required
				       type="number"><br><br>

				<label for="time">时间：</label>
				<input id="time"
				       v-model="formData.time"
				       name="time"
				       required
				       type="date"><br><br>

				<label for="require">要求：</label>
				<input id="require"
				       v-model="formData.require"
				       name="require"
				       placeholder="请输入任职要求"
				       required
				       type="text"><br><br>

				<label for="salary">待遇：</label>
				<input id="salary"
				       v-model="formData.salary"
				       name="salary"
				       placeholder="请输入待遇"
				       required
				       type="number"><br><br>

				<label for="subsidy">是否补助：</label>
				<input id="subsidy"
				       v-model="formData.subsidy"
				       name="subsidy"
				       required
				       type="checkbox"><br><br>

				<label for="tel">联系：</label>
				<input id="tel"
				       v-model="formData.tel"
				       name="tel"
				       placeholder="请输入联系方式"
				       required
				       type="tel"><br><br>

				<button type="submit" value="Submit"
				        @click.prevent="handleSubmit">
					发布
				</button>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.border {
	border: 1px #000 solid;
}

h1 {
	width: 80vw;
	margin: 5vh auto 1vh;
}

.container {
	display: flex;
	margin:  5vh auto;
	width: 80vw;
	height: auto;
	box-sizing: border-box;

	.left {
		width: 75%;
		table{
			width: 95%;
			margin: 0 auto  3vh;
		}
	}

	.pub {
		position: sticky;
		top: 1vh;
		width: 25%;
		height: 100%;
		margin: 2vh 3vw;

		h1 {

		}
	}
}


.tabs {
	display: flex;
	align-items: center;


	button {
		display: inline-block;
		margin-right: 15px;
		width: 70px;
		height: 40px;
		cursor: pointer;
		text-align: center;
	}
}

.active {
	color: blue;
}

.table {
	width: 90vw;
	margin: 0 auto;
}

table {
	border-collapse: collapse;
	width: 100%;
	margin-bottom: 20px;
}

th, td {
	border: 1px solid #ddd;
	padding: 8px;
	text-align: left;
}

th {
	background-color: #f2f2f2;
}

tr {
	&:nth-child(even) {
		background-color: #f2f2f2;
	}
}

#links {
	text-align: center;
	margin-top: 20px;

	a {
		&:hover {
			background-color: #ddd;
		}
	}

	span {
		background-color: #ddd;
		color: #333;
		border: 1px solid #ddd;
	}
}

#links a, #links span {
	display: inline-block;
	padding: 5px 5px;
	margin-right: 5px;
	color: #333;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 3px;
	text-decoration: none;
}
</style>
