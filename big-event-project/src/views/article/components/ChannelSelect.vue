<script setup>
import { getArtChannelService } from '@/api/article'
import { onMounted, ref } from 'vue';

const channelList = ref([])

// 得到下拉选项数据
const getArtChannelList = async () => {
  const res = await getArtChannelService()
  channelList.value = res.data.data
  console.log(channelList.value)
}

onMounted(() => {
  getArtChannelList()
})

// 子传父并通知父组件
defineProps({
  modelValue: {
    type: [String, Number]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

</script>

<template>
  <el-select :style="{ width }" :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option :value="channel.id" :label="channel.cate_name" v-for="channel in channelList" :key="channel.id"></el-option>
  </el-select>
</template>