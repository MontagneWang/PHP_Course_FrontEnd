<script lang="ts" setup>
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import axios from '../api/axios';
import {useCounterStore} from '../stores'

const store = useCounterStore()
const {POST_CONFIG:config} = store
let data = ref([])
let buttonCount = ref(0)
onMounted(async () => {
	let {data: response} = await axios.get('/FinalTerm/getCompanyData.php?page=1');
	data.value = response
	store.infoData = data.value
})

let currentTab = ref(0);
let currentPage = ref(1)

function changeTab(tab) {
	currentTab.value = tab;
}

function changePage(page) {
	currentPage.value = page;
}

const categories = {
	0: 'getCompanyData',
	1: 'getPositionsData',
	2: 'getTalentsData'
};
watchEffect(async () => {
	let {data: response} = await axios.get(`/FinalTerm/${categories[currentTab.value]}.php?page=${currentPage.value}`);
	data.value = response
	store.infoData = data.value
})
// 类别改动时，将 currentPage 重置为 1
watch(currentTab, () => {
	// 设置延时，因为在修改[列表]时也会同步修改[页数]，有几率导致页数无法重置，所以页数的修改需要滞后于列表修改请求
	setTimeout(() => {
		currentPage.value = 1
		keyWords.value = ''
	}, 50)
})

let keyWords = ref('')

async function sendKeyWords(keyWords) {
	let url: string
	keyWords.trim() === '' ?
			url = `/FinalTerm/${categories[currentTab.value]}.php?page=1` :
			url = `/FinalTerm/getKeyWords.php?kwd=${keyWords}&cate=${currentTab.value}`
	let {data: response} = await axios.get(url)
	data.value = response
}

watch(keyWords, (keyWords) => {
	sendKeyWords(keyWords)
})
// watchEffect(() => {
// 	buttonCount.value = data.value.length
// })

// let range = computed(() => Array.from({length: (buttonCount.value + 9) / 10}, (_, i) => i))
async function onCheckboxChanged(event) {
	if (event.target.type === 'checkbox' && store.userId>0) {
		await axios.post(`/FinalTerm/setUserStar.php`, {
			id: store.userId,
			deleteId: event.target.parentNode.parentNode.children[0].innerText,
			cate: event.target.parentNode.parentNode.children[0].className,
			// isChecked: event.target.checked
		}, config)
	}
}
</script>

<template>
	<div class="table">
		<!-- Tab 头部 -->
		<div class="tabs">
			<h2>请选择您要搜索的类别：</h2>
			<button :class="{ active: currentTab === 0 }" @click="changeTab(0)">公司</button>
			<button :class="{ active: currentTab === 1 }" @click="changeTab(1)">职位</button>
			<button :class="{ active: currentTab === 2 }" @click="changeTab(2)">人才</button>
		</div>

		<span>输入您想搜索的内容：</span>
		<input v-model="keyWords"
		       placeholder="您可通过任意关键字搜索"
		       type="text"
		       @keyup.enter="sendKeyWords(keyWords)">
		<!--<button @click="sendKeyWords(keyWords)">搜索一下</button>-->
		<br>
		<br>
		<!-- Tab 内容 -->
		<div class="tab-content">
			<div v-show="currentTab === 0">
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th v-if='store.userId>0'>收藏</th>
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
						<td class="company" style="text-align: center;">{{ item.id }}</td>
						<td v-if='store.userId>0'><input type="checkbox" :checked="store.userInfo.starCompany.includes(item.id)"></td>
						<td>{{ item.industry }}</td>
						<td>{{ item.name }}</td>
						<td>{{ item.address }}</td>
						<td>{{ item.legal_person }}</td>
						<td style="text-align: right;">{{ item.registered_capital }}</td>
						<td>{{ item.other_info }}</td>
						<td style="text-align: right;">{{ item.contact }}</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div v-show="currentTab === 1">
				<table @change="onCheckboxChanged">
					<thead>
					<tr>
						<th style="width: 2em">编号</th>
						<th v-if='store.userId>0' style="width: 2em">收藏</th>
						<th v-if='store.userId>0' style="width: 2em">应聘</th>
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
						<td class="positions" style="text-align: center;">
							{{ item.id }}
						</td>
						<td v-if='store.userId>0'><input type="checkbox" :checked="store.userInfo.starPositions.includes(item.id)"></td>
						<td v-if='store.userId>0'><input type="checkbox" :checked="store.userInfo.record.includes(item.id)"></td>
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
					</tr>
					</tbody>
				</table>
			</div>
			<div v-show="currentTab === 2">
				<table>
					<thead >
					<tr>
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
					<tr v-for="(item, index) in data" :key="item.id ">
						<td style="text-align: center;">{{ item.id }}</td>
						<td>{{ item.name }}</td>
						<td>{{ item.job_type }}</td>
						<td>{{ item.age }}</td>
						<td>{{ item.native_place }}</td>
						<td style="text-align: right;">{{ item.education }}</td>
						<td>{{ item.resume }}</td>
						<td style="text-align: right;">{{ item.contact }}</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!--todo 按钮完善-->
		<div v-show="data.length>9" class="page-button">
			<ul>
				<li v-for="index in 5" :key="index">
					<button @click="changePage(index)">{{ index }}</button>
				</li>
			</ul>
		</div>

	</div>

</template>

<style lang="scss" scoped>
//.rightMenu {
//	width: 80px;
//	height: 40px;
//	position: fixed;
//	display: flex;
//	align-items: center;
//	justify-content: center;
//	border: 1px solid #000;
//	border-radius: 10px;
//	cursor: pointer;
//	z-index: 10;
//}

input {
	margin-right: 10px;
}

.page-button {
	margin: -5px 0;

	ul {
		padding-left: 0;

		li {
			margin: 0 10px;
			display: inline-block;

			button {
				width: 40px;
				height: 40px;
			}
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
