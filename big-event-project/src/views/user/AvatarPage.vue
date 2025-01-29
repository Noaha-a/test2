<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { userStore } from '@/store'
import { userUpdateAvatarService } from '@/api/user'

// 基于 store 的数据，初始化头像
const userStoreData = userStore()
const imageUrl = ref(userStoreData.user.user_pic)

const uploadRef = ref(null)

// 选择头像
const onSelectImage = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imageUrl.value = reader.result
  }
}

// 上传头像
const onUploadImage = async () => {
  await userUpdateAvatarService(imageUrl.value)
  // 刷新用户信息
  await userStoreData.getUser()
  // 提示
  ElMessage.success('更换头像成功')
}
</script>

<template>
  <PageContainer title="更换头像">
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onSelectImage"
      ref="uploadRef"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br/>
    <el-button type="primary" @click="uploadRef.$el.querySelector('input').click()" :icon="Plus" size="large">选择图片</el-button>
    <el-button type="success" @click="onUploadImage" :icon="Upload" size="large">上传图片</el-button>
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>