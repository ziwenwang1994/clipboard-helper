<script setup>
import {ref, onMounted} from "vue";
import RecordItem from "./RecordItem.vue"
const listDom = ref(null);
defineProps({
    recordItems: {
        default: () => [],
        type: Array
    }
})


onMounted(() => {
    listDom.value?.scrollTo({
        top: 999999999,
        behavior: "smooth",
    })
});
</script>

<template>
    <ul class="list-container" ref="listDom">
        <li v-for="item in recordItems" :key="item.id">
            <RecordItem :timestamp="item.timestamp" :text="item.text" :cid="item.id" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.list-container {
    height: 400px;
    overflow: auto;
    padding: 0;

    li {
        margin: 8px 0;
        display: block;
        list-style: none;
    }
}
</style>
