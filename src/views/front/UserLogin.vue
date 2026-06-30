<template>
  <div class="login-box">
    <h2>乐器商城 用户登录</h2>
    <el-form ref="formRef" :model="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const form = ref({ username:"user", password:"123456" })
const login = () => {
  localStorage.setItem("userToken", "user123")
  localStorage.setItem("userInfo", JSON.stringify({ username: form.value.username }))
  ElMessage.success("登录成功，欢迎选购乐器！")
  router.push("/")
}
</script>

<style scoped>
.login-box {
  max-width: 400px;
  width: 90%;
  margin: 100px auto;
}

@media (max-width: 768px) {
  .login-box {
    margin: 60px auto;
  }
}

@media (max-width: 480px) {
  .login-box {
    margin: 40px auto;
  }
}
</style>