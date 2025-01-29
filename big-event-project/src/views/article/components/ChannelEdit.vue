<script setup>
import { ref } from 'vue'
import { addArtChannelService, editArtChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
// 获取表单实例
const formRef = ref()

const dialogForm = ref({
  cate_name: '',
  cate_alias: ''
})

const open = (row) => {
  // row 为空则表单重置，否则表单数据回显
  dialogForm.value = { ...row } // { ...row } 是得到 row 的具体数据，直接 row 得不到
  dialogVisible.value = true
}

// 子传父重新渲染页面数据
const emit = defineEmits(['success'])

const onSubmit = async () => {
  // 预校验
  await formRef.value.validate()
  const hasId = dialogForm.value.id
  if (hasId) {
    editArtChannelService(dialogForm.value)
  } else {
    addArtChannelService(dialogForm.value)
  }
  ElMessage.success({
    type: 'success',
    message: hasId ? '编辑成功' : '添加成功'
  })
  dialogVisible.value = false
  emit('success')
}

const rules = {
  cate_name: [
    { required: true, message: '请输入类名', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '必须为非空的 1 到 10 位的字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入别称', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '必须为字母或数字的 1 到 15 位的字符', trigger: 'blur' }
  ]
}

// 把 open 方法暴露出去，其他组件可使用
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogForm.id ? '编辑分类' : '添加分类'"
    width="30%"
    label-width="100px"
    style="padding-right: 30px;"
  >
    <el-form :model="dialogForm" :rules="rules" ref="formRef">
      <el-form-item label="类名" prop="cate_name">
        <el-input v-model="dialogForm.cate_name" placeholder="请输入类名"></el-input>
      </el-form-item>
      <el-form-item label="别称" prop="cate_alias">
        <el-input v-model="dialogForm.cate_alias" placeholder="请输入别称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>