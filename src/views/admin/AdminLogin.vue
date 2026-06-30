<template>
  <div class="admin-login">
    <h2>乐器商城 商家后台登录</h2>
    <el-form :model="form" label-width="90px">
      <el-form-item label="管理员账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">进入后台</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const form = { username:"admin", password:"admin123" }
const login = () => {
  localStorage.setItem("adminToken", "admin666")
  ElMessage.success("后台登录成功")
  router.push("/admin")
}
</script>
<style scoped>
.admin-login {
  max-width: 420px;
  width: 90%;
  margin: 120px auto;
}

@media (max-width: 768px) {
  .admin-login {
    margin: 60px auto;
  }
}

@media (max-width: 480px) {
  .admin-login {
    margin: 40px auto;
  }
}
</style>