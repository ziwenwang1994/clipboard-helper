<script setup>
import { useCounterStore } from "@/stores/counter";
import RecordList from "./RecordList.vue";
import { computed } from "vue";
import { ElButton } from "element-plus";

const store = useCounterStore();
const recordsToShow = computed(() => store.records);
const clearAll = store.clearRecords;
const toggleRecording = store.toggleRecording;
</script>

<template>
  <main>
    <div class="panel">
      <el-button :type="store.recording ? 'warning' : 'primary'" @click="toggleRecording">
        {{ store.recording ? "Stop Recording" : "Start Recording"}}
      </el-button>
      <el-button type="danger" @click="clearAll">
        Clear All
      </el-button>
    </div>
    <RecordList :recordItems="recordsToShow" />
  </main>
</template>

<style lang="scss" scoped>
.panel {
  padding: 16px 0;
}
</style>