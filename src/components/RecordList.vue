<script setup>
import RecordItem from "./RecordItem.vue"
const props = defineProps({
    recordItems: {
        default: () => [],
        type: Array
    }
})
console.log(props.recordItems);
</script>

<template>
    <ul class="list-container">
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
