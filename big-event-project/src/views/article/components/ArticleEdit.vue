<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { addArticleService, getArtDetailService, updateArtService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

// 抽屉显示
const isVisibleDrawer = ref(false)

// 表单数据
const defaultForm = ref({
  cate_id: '',
  title: '',
  cover_img: '',
  content: '',
  state: ''
})

// 图片预览
const imageUrl = ref('')

const onChangeFile = (uploadFile) => {
  // 创建本地 url
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // 图片赋值给表单对应元素
  formModel.value.cover_img = uploadFile.raw
}

// 上传成功后通知父组件跳转页数等
const emit = defineEmits(['success'])

// 上传处理
const onPublish = async (state) => {
  // 把状态存入 formModel
  formModel.value.state = state
  // 转为 formData 格式
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    // 如果是编辑
    await updateArtService()
    ElMessage.success('编辑成功')
    isVisibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await addArticleService()
    ElMessage.success('添加成功')
    isVisibleDrawer.value = false
    emit('success', 'add')
  }
}

// 获取编辑器实例
const editorRef = ref()

const formModel = ref({ ...defaultForm })

const open = async (row) => {
  isVisibleDrawer.value = true
  // console.log(row)
  if (row.id) {
    // 编辑时进行请求详情数据
    const res = await getArtDetailService(row.id)
    formModel.value = res.data.data
    console.log(formModel.value)
    // 图片地址需要自己拼接
    imageUrl.value = baseURL + formModel.value.cover_img
    const file = await imageUrlToFile(imageUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    // 添加时则重置表单数据
    formModel.value = { ...defaultForm }
    // 图片预览和富文本编辑器部分不在 formModel 中，需要自己手动重置
    imageUrl.value = ''
    // 有特定格式
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}

defineExpose([
  open
])
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 图片预览 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="onChangeFile"
          :auto-upload="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor ref="editorRef" theme="snow" v-model:content="formModel.content" content-type="html"></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>