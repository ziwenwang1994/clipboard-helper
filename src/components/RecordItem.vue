<script setup>
import { ElButton } from "element-plus"
import { useCounterStore } from "@/stores/counter";
import {
    Delete,
    CopyDocument
} from '@element-plus/icons-vue'
import dayjs from "dayjs"
import { ref } from "vue";
const store = useCounterStore();
const {
    text, timestamp, cid
} = defineProps({
    timestamp: {
        type: Number,
        default: 0
    },
    cid: {
        type: Number,
        default: 0
    },
    text: {
        type: String,
        default: ""
    }
})
const date = ref(dayjs(timestamp).format())

function deleteRecord() {
    store.deleteRecord(cid);
}

async function copy() {
    await navigator.clipboard.writeText(text);
}

</script>

<template>
    <div class="card">
        <h2>
            <span>{{ date }}</span>
        </h2>
        <p class="text item">{{ text }}</p>
        <div class="panel">
            <ElButton type="danger" @click="deleteRecord" :icon="Delete" circle size="small" />
            <ElButton type="primary" @click="copy" :icon="CopyDocument" circle size="small" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    font-size: 14px;
    background: #2e814a28;
    border-radius: 4px;
    overflow: hidden;

    h2 {
        font-size: 14px;
        line-height: 1;
        height: 1;
        padding: 4px;
        display: flex;
        font-weight: 700;
        background: #86f3aa9f;
    }
    ::-webkit-scrollbar {
        width: 8px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f10c;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #5e987150;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #03942cd3;
    }
    .text {
        padding: 4px;
        word-break: break-all;
        word-wrap: break-word;
        max-height: 80px;
        overflow: auto;
        background: #ffffff97;
        transition: all 0.2s ease-in-out;
    }

    .text:hover {
        background: #fff;
    }

    .panel {
        padding: 4px;
        display: flex;
        align-items: center;
    }
}
</style>