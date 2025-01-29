<script setup>
import ch from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="ch">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped>
</style>
