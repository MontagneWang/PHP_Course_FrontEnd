<script lang="ts" setup>
import {onMounted, ref, watchEffect} from "vue";
import axios from "../api/axios";
import {useCounterStore} from '../stores'

const store = useCounterStore()
const {POST_CONFIG: config} = store
let currentTab = ref(0);

function changeTab(tab) {
	currentTab.value = tab;
}

let data = ref([])

onMounted(async () => {
	let {data: response} = await axios.get('/FinalTerm/getCompanyAll.php');
	data.value = response
})


const categories = {
	0: 'getCompanyAll',
	1: 'getPositionsAll',
	2: 'getTalentsAll'
};
watchEffect(async () => {
	let {data: response} = await axios.get(`/FinalTerm/${categories[currentTab.value]}.php`);
	data.value = response
	store.infoData = data.value
})

async function onCheckboxChanged(event) {
	if (event.target.type === 'checkbox') {
		await axios.post(`/FinalTerm/setAudit.php`, {
			auditId: event.target.parentNode.parentNode.children[1].innerText,
			cate: event.target.parentNode.parentNode.children[1].className,
		}, config)
	}
}
</script>

<template>
	<div class="table">
		<h1>后台审核</h1>
		<!-- Tab 头部 -->
		<div class="tabs">
			<button :class="{ active: currentTab === 0 }"
			        @click="changeTab(0)">公司
			</button>
			<button :class="{ active: currentTab === 1 }"
			        @click="changeTab(1)">职位
			</button>
			<button :class="{ active: currentTab === 2 }"
			        @click="changeTab(2)">人才
			</button>
		</div>

		<br>
		<!-- Tab 内容 -->
		<div class="tab-content">
			<div v-show="currentTab === 0">
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th style="width: 2em">审核</th>
						<th>编号</th>
						<th>所属行业</th>
						<th>名称</th>
						<th>地址</th>
						<th>法人</th>
						<th>注册资本</th>
						<th>其它介绍</th>
						<th>联系方式</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) in data" :key="item.id">
						<template v-if="item.auditStatus==='0'">
							<td><input
									:checked="false" type="checkbox">
							</td>
							<td class="company" style="text-align: center;">{{ item.id }}</td>
							<td>{{ item.industry }}</td>
							<td>{{ item.name }}</td>
							<td>{{ item.address }}</td>
							<td>{{ item.legal_person }}</td>
							<td style="text-align: right;">{{ item.registered_capital }}</td>
							<td>{{ item.other_info }}</td>
							<td style="text-align: right;">{{ item.contact }}</td>
						</template>
					</tr>
					</tbody>
				</table>
			</div>
			<div v-show="currentTab === 1">
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th style="width: 2em">审核</th>
						<th style="width: 2em">编号</th>
						<th style="width: 8em">名称</th>
						<th style="width: 2em">人数</th>
						<th style="width: 6em">发布时间</th>
						<th>任职要求</th>
						<th>待遇</th>
						<th style="width: 2em">补助</th>
						<th style="width: 7em">联系方式</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) in data" :key="item.id">
						<template v-if="item.auditStatus==='0'">
							<td><input
									:checked="false" type="checkbox">
							</td>
							<td class="positions" >{{ item.id }}</td>
							<td>{{ item.name }}</td>
							<td>{{ item.number_of_people }}</td>
							<td>{{ item.release_time }}</td>
							<td style="font-size: 0.7rem">{{ item.job_requirements }}</td>
							<td style="text-align: right;">
								{{ item.salary }}
							</td>
							<td>
								<input :checked="item.subsidy==='1'"
								       disabled
								       type="checkbox">
							</td>
							<td style="text-align: right;">
								{{ item.contact }}
							</td>
						</template>
					</tr>
					</tbody>
				</table>
			</div>
			<div v-show="currentTab === 2">
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th style="width: 2em">审核</th>
						<th style="width: 2em">编号</th>
						<th>姓名</th>
						<th>求职类型</th>
						<th>年龄</th>
						<th>籍贯</th>
						<th>学历</th>
						<th>简历</th>
						<th>联系方式</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="item in data" :key="item.id ">
						<template v-if="item.auditStatus==='0'">
							<td><input
									:checked="false" type="checkbox">
							</td>
							<td class="talents"  style="text-align: center;">{{ item.id }}</td>
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

	</div>

</template>

<style lang="scss" scoped>
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
