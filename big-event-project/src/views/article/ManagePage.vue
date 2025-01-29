<script setup>
import { onMounted, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { getArticleSerive, delArticleService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage } from 'element-plus'

const articleList = ref([])
// 总条数
const total = ref(0)

// 是否加载
const isLoad = ref(false)

const params = ref({
  pageNum: 1,
  pageSize: 5,
  cate_id: '',
  state: ''
})

const getArticleList = async () => {
  isLoad.value = true
  const res = await getArticleSerive(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  isLoad.value = false
}

onMounted(() => {
  getArticleList()
})

// 分页管理
// 更改每页数据条数
const handleSizeChange = (size) => {
  // 当前页数据可能不在该页，所以重置为第一页
  params.value.pageNum = 1
  params.value.pageSize = size
  // 重新渲染
  getArticleList()
}

// 更改所在页数
const handleCurrentChange = (page) => {
  params.value.pageNum = page
  getArticleList()
}

// 分类查询 => 到底咋实现分类的？
const onSearch = () => {
  params.value.pageNum = 1
  getArticleList()
}

// 重置
const onReset = () => {
  params.value.pageNum = 1
  params.value.state = ''
  params.value.cate_id = ''
  getArticleList()
}

// 获取抽屉实例
const articleRef = ref()

const onAddArticle = () => {
  articleRef.value.open({})
}

const onEditArticle = (row) => {
  articleRef.value.open(row)
}

const onDelArticle = async (id) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await delArticleService(id)
  ElMessage.success('删除成功')
  getArticleList()
}

// 接收抽屉组件的请求事件
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加
    // 更新最后一页，因为数据条数增多了
    const lastPage = Math.ceil((total.value + 1) / params.value.pageSize)
    params.value.pageNum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle"> 发布文章 </el-button>
    </template>

    <!-- inline 默认为一行显示 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state">
          <el-option value="已发布" label="已发布"></el-option>
          <el-option value="草稿" label="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="articleList" v-loading="isLoad">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="pub_date"></el-table-column>
      <el-table-column label="发布时间" prop="state"></el-table-column>
      <el-table-column label="状态" prop="cate_name">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <button circle type="primary" plain :icon="Edit" @click="onEditArticle(row)"></button>
          <button circle type="danger" plain :icon="Delete" @click="onDelArticle(row.id)"></button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页管理 -->
    <el-pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 5, 7]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" style="justify-content: flex-end;"
    />

    <ArticleEdit ref="articleRef" @success="onSuccess"></ArticleEdit>

  </page-container>
</template>