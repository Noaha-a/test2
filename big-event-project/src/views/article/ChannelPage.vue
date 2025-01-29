<script setup>
import { getArtChannelService, delArtChannelService } from '@/api/article'
import { onMounted, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage } from 'element-plus'

const channelList = ref([])
// 加载效果
const isLoad = ref(false)
const dialog = ref()

const getArtChannelList = async () => {
  isLoad.value = true
  const res = await getArtChannelService()
  channelList.value = res.data.data
  isLoad.value = false
}

onMounted(() => {
  getArtChannelList()
})

const onDeleteChannel = async (id) => {
  // 等待用户操作后再决定是否真的删除
  await ElMessageBox.confirm(
    '确定要删除吗',
    '温馨提示',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  // 删除成功后提示用户
  await delArtChannelService(id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArtChannelList()
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onEditChannel = (row) => {
  dialog.value.open(row)
}

const onSuccess = () => {
  getArtChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel"> 添加分类 </el-button>
    </template>

    <el-table v-loading="isLoad" :data="channelList" style="width:100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="类名"></el-table-column>
      <el-table-column prop="cate_alias" label="别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button plain :icon="Edit" @click="onEditChannel(row)" type="primary" circle></el-button>
          <el-button plain :icon="Delete" @click="onDeleteChannel(row.id)" type="danger" circle></el-button>
        </template>
      </el-table-column>

      <!-- 无数据时 -->
      <template #empty>
        <el-empty description="空" />
      </template>
    </el-table>

    <!-- 监听 success 事件 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>