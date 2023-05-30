<script lang="ts" setup>
import {onMounted, ref, watchEffect} from "vue";
import axios from "../api/axios";
import {useCounterStore} from '../stores'

const store = useCounterStore()
let resumeText = ref('')
const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
};

onMounted(async () => {
	let {data: response} = await axios.get(`/FinalTerm/getResume.php?id=${store.userId}`)
	resumeText.value = response
})
watchEffect(async () => {
	await axios.post(`/FinalTerm/setResume.php`, {
		id: store.userId,
		resume: resumeText.value
	}, config)
})
</script>

<template>
	<h1>我的信息</h1>
	<div class="container border">
		<div class="left border">
			<div class="star border">
				<h3>&emsp;我的收藏：</h3>
				<ul>
					<li></li>
				</ul>
			</div>
			<div class="record border">
				<h3>&emsp;应聘记录：</h3>
				<ul>
					<li></li>
				</ul>
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
.border {
	border: 1px #000 solid;
}

h1 {
	width: 80vw;
	margin: 5vh auto 1vh;
}

.container {
	display: flex;
	margin: 0 auto;
	width: 80vw;
	height: 70vh;
	box-sizing: border-box;

	.left {
		width: 40%;

		.star {
			height: 60%;
		}

		.record {
			height: 39.5%;
		}
	}

	.resume {
		width: 60%;
		height: 100%;

		textarea {
			margin-left: 2vw;
			width: 92%;
			height: 80%;
		}
	}
}
</style>
