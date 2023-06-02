<script lang="ts" setup>
import {onMounted, ref, watchEffect} from "vue";
import axios from "../api/axios";
import {useCounterStore} from '../stores'

const store = useCounterStore()
const {POST_CONFIG: config} = store
let resumeText = ref('')
let dataCompany = ref({})
let dataPositions = ref({})

onMounted(async () => {
	let {data: response} = await axios.get(`/FinalTerm/getResume.php?id=${store.userId}`)
	resumeText.value = response
	let {data: response1} = await axios.get(`/FinalTerm/getCompanyData.php`)
	dataCompany.value = response1
	let {data: response2} = await axios.get(`/FinalTerm/getPositionsData.php`)
	dataPositions.value = response2
})
watchEffect(async () => {
	if (resumeText.value && store.userInfo.identity === '0') {
		await axios.post(`/FinalTerm/setResume.php`, {
			id: store.userId,
			resume: resumeText.value
		}, config)
	}
})


// document.addEventListener('click', e => {
// 	if (e.target.tagName === 'TD') {
// 		e.preventDefault();
// 		console.log(e.target.parentNode.children[1].innerText);
// 		console.log(e.target.parentNode.children[1].className);
// 	}
// });

async function onCheckboxChanged(event) {
	if (event.target.type === 'checkbox') {
		await axios.post(`/FinalTerm/setUserStar.php`, {
			id: store.userId,
			// 当前选中的 id
			deleteId: event.target.parentNode.parentNode.children[1].innerText,
			// 当前选中的分类
			cate: event.target.parentNode.parentNode.children[1].className,
			// isChecked: event.target.checked
		}, config)
	}
}
</script>

<template>
	<h1>我的信息&emsp;
		<span class="audit"
		      :class="store.userInfo.auditStatus!=='0'?'success':'pending'">
			{{store.userInfo.auditStatus!=='0'?'已审核':'待审核'}}
		</span>
	</h1>
	<div class="container border">
		<div class="left border">
			<div class="star border">
				<h3>&emsp;我的收藏：</h3>
				<h4>&emsp;&emsp;公司：</h4>
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th v-if='store.userId>0' style="width: 2em">收藏</th>
						<th style="width: 2em">编号</th>
						<th style="width: 3em">行业</th>
						<th>名称</th>
						<th>地址</th>
						<th>介绍</th>
						<th>联系</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) in dataCompany" :key="item.id ">
						<template v-if="store.userInfo.starCompany.includes(item.id)">
							<td v-if='store.userId>0'><input :checked="store.userInfo.starCompany.includes(item.id)" type="checkbox">
							</td>
							<td class="company">{{ item.id }}</td>
							<td>{{ item.industry }}</td>
							<td>{{ item.name }}</td>
							<td>{{ item.address }}</td>
							<td>{{ item.other_info }}</td>
							<td style="text-align: right;">{{ item.contact }}</td>
						</template>
					</tr>
					</tbody>
				</table>
				<br>
				<h4 style="margin-top: -5vh;">&emsp;&emsp;职位：</h4>
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th v-if='store.userId>0' style="width: 2em">收藏</th>
						<th style="width: 2em">编号</th>
						<th style="width: 8em">名称</th>
						<th style="width: 2em">人数</th>
						<th>任职要求</th>
						<th>待遇</th>
						<th style="width: 2em">补助</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) in dataPositions" :key="item.id ">
						<template v-if="store.userInfo.starPositions.includes(item.id)">
							<td v-if='store.userId>0'><input :checked="store.userInfo.starPositions.includes(item.id)"
							                                 type="checkbox"></td>
							<td class="positions">{{ item.id }}</td>
							<td>{{ item.name }}</td>
							<td>{{ item.number_of_people }}</td>
							<td style="font-size: 0.7rem">{{ item.job_requirements }}</td>
							<td style="text-align: right;">
								{{ item.salary }}
							</td>
							<td>
								<input :checked="item.subsidy==='1'"
								       disabled
								       type="checkbox">
							</td>
						</template>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="record border">
				<h3>&emsp;应聘记录：</h3>
				<table>
					<thead>
					<tr>
						<th v-if='store.userId>0' style="width: 2em">应聘</th>
						<th style="width: 2em">编号</th>
						<th style="width: 8em">名称</th>
						<th style="width: 2em">人数</th>
						<th>任职要求</th>
						<th>待遇</th>
						<th style="width: 2em">补助</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) in dataPositions" :key="item.id ">
						<template v-if="store.userInfo.record.includes(item.id)">
							<td v-if='store.userId>0'><input disabled :checked="store.userInfo.record.includes(item.id)" type="checkbox"></td>
							<td class="record">{{ item.id }}</td>
							<td>{{ item.name }}</td>
							<td>{{ item.number_of_people }}</td>
							<td style="font-size: 0.7rem">{{ item.job_requirements }}</td>
							<td style="text-align: right;">
								{{ item.salary }}
							</td>
							<td>
								<input :checked="item.subsidy==='1'"
								       disabled
								       type="checkbox">
							</td>
						</template>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="resume ">
			<h3>&emsp;我的简历：</h3>
			<textarea v-model="resumeText"
			          placeholder="您还没有填写简历"></textarea>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.audit{
	border-radius: 15px;
	padding: 10px 15px;
	font-size: 1.5rem;
	&.success{
		border:3px solid #7FFF00;
		color: #66ccff;
	}
	&.pending{
		border:3px solid #f6b83f;
		color: #f54200;
	}
}
.border {
	border: 1px #000 solid;
}

h1 {
	width: 80vw;
	margin: 5vh auto 1vh;
}

.container {
	display: flex;
	margin: 5vh auto;
	width: 80vw;
	box-sizing: border-box;

	.left {
		width: 60%;

		table {
			width: 90%;
			margin: 0 auto 5vh;
			overflow-y: scroll;
		}

		.star {
		}

		.record {
		}
	}

	.resume {
		position: sticky;
		top: 0;
		width: 40%;
		height: 100%;

		textarea {
			margin-left: 1.5vw;
			width: 90%;
			min-height: 80vh;
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
