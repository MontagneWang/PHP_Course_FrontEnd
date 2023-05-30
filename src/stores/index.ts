import {defineStore} from 'pinia'
import {computed, ref} from "vue";

export const useCounterStore = defineStore('counter', () => {
	let LoginIdentity = ref(-1)
	const count = ref(0)
	let double = computed(count => count * 2)

	function increment() {
		count.value++
	}

	return {isAlreadyLogin: LoginIdentity, count, double, increment}
})