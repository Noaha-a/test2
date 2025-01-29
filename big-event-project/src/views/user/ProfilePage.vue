<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { userStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const { user: { id, username, nickname, email}, getUser } = userStore()

const formRef = ref(null)
const form = ref({
  id,
  username,
  nickname,
  email
})

const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '用户昵称长度必须在 2 到 10 位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
})

const submitForm = async () => {
  // 表单验证
  await formRef.value.validate()
  // 调用接口
  await userUpdateInfoService(form.value)
  // 刷新用户信息
  await getUser()
  // 提示
  ElMessage.success('修改成功')
}
</script>

<template>
  <PageContainer title="修改资料">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<style>
</style>