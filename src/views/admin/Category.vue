<template>
  <div class="cate">
    <div class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
      <i class="el-icon-menu"></i>
    </div>

    <el-menu mode="horizontal" router class="desktop-menu">
      <el-menu-item index="/admin">首页看板</el-menu-item>
      <el-menu-item index="/admin/category">乐器分类</el-menu-item>
      <el-menu-item index="/admin/goods">商品管理</el-menu-item>
      <el-menu-item index="/admin/orders">订单管理</el-menu-item>
      <el-menu-item index="/admin/users">用户管理</el-menu-item>
      <el-menu-item index="/admin/info">个人中心</el-menu-item>
      <el-menu-item index="/">返回商城前台</el-menu-item>
    </el-menu>

    <transition name="slide">
      <el-menu v-if="showMobileMenu" mode="vertical" router class="mobile-menu">
        <el-menu-item index="/admin" @click="showMobileMenu = false">首页看板</el-menu-item>
        <el-menu-item index="/admin/category" @click="showMobileMenu = false">乐器分类</el-menu-item>
        <el-menu-item index="/admin/goods" @click="showMobileMenu = false">商品管理</el-menu-item>
        <el-menu-item index="/admin/orders" @click="showMobileMenu = false">订单管理</el-menu-item>
        <el-menu-item index="/admin/users" @click="showMobileMenu = false">用户管理</el-menu-item>
        <el-menu-item index="/admin/info" @click="showMobileMenu = false">个人中心</el-menu-item>
        <el-menu-item index="/" @click="showMobileMenu = false">返回商城前台</el-menu-item>
      </el-menu>
    </transition>

    <div style="margin:20px 0">
      <el-button type="primary" @click="openDialog">新增乐器分类</el-button>
    </div>

    <div class="category-grid">
      <el-card 
        v-for="item in cateList" 
        :key="item.id" 
        class="category-card"
        :style="{ borderLeft: '4px solid ' + item.color }"
      >
        <div class="category-header">
          <div class="category-icon" :style="{ background: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="category-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <div class="category-stats">
            <div class="stat-item">
              <span class="stat-num">{{ item.goodsCount }}</span>
              <span class="stat-label">商品数</span>
            </div>
          </div>
        </div>
        <div class="category-actions">
          <el-button size="small" @click="edit(item)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(item.id)">删除</el-button>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible" title="分类编辑">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" placeholder="输入乐器分类名"/>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="form.description" placeholder="输入分类描述" type="textarea"/>
        </el-form-item>
        <el-form-item label="选择图标">
          <el-select v-model="form.icon" placeholder="选择图标">
            <el-option label="吉他" value="el-icon-guitar"/>
            <el-option label="音乐" value="el-icon-music"/>
            <el-option label="文档" value="el-icon-document"/>
            <el-option label="耳机" value="el-icon-headset"/>
            <el-option label="鼓" value="el-icon-drum"/>
            <el-option label="麦克风" value="el-icon-microphone"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择颜色">
          <el-color-picker v-model="form.color" show-alpha />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const showMobileMenu = ref(false)
const dialogVisible = ref(false)
const form = ref({ id:"", name:"", description:"", icon:"el-icon-guitar", color:"#667eea" })
const cateList = ref([
  {id:1, name:"吉他类", description:"包含民谣吉他、电吉他、尤克里里等弦鸣乐器", icon:"el-icon-guitar", color:"#667eea", goodsCount:12},
  {id:2, name:"钢琴类", description:"包含电子钢琴、电钢、钢琴配件等键盘乐器", icon:"el-icon-music", color:"#f5a623", goodsCount:8},
  {id:3, name:"民乐", description:"包含古筝、二胡、笛子等传统民族乐器", icon:"el-icon-document", color:"#722ed1", goodsCount:7},
  {id:4, name:"弦乐", description:"包含小提琴、大提琴、中提琴等弓弦乐器", icon:"el-icon-headset", color:"#13c2c2", goodsCount:4},
  {id:5, name:"打击乐", description:"包含架子鼓、镲片、手鼓等打击乐器", icon:"el-icon-drum", color:"#eb2f96", goodsCount:4}
])
const openDialog = () => {
  form.value = { id:"", name:"", description:"", icon:"el-icon-guitar", color:"#667eea" }
  dialogVisible.value = true
}
const edit = (row) => {
  form.value = {...row}
  dialogVisible.value = true
}
const save = () => {
  if(!form.value.name) {
    ElMessage.warning('请输入分类名称')
    return
  }
  if(!form.value.id) {
    cateList.value.push({ ...form.value, id:Date.now(), goodsCount: 0 })
  }
  dialogVisible.value = false
  ElMessage.success("保存成功")
}
const del = (id) => {
  cateList.value = cateList.value.filter(item=>item.id != id)
  ElMessage.success("删除完成")
}
</script>

<style scoped>
.cate {
  padding: 24px;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 1000;
  font-size: 28px;
  cursor: pointer;
  color: #667eea;
}

.desktop-menu {
  display: flex;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  background: white;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  padding: 20px;
  transition: all 0.3s ease;
}

.category-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-info h3 {
  margin: 0 0 5px;
  font-size: 18px;
}

.category-info p {
  margin: 0;
  font-size: 13px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-stats {
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.category-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .cate {
    padding: 15px;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .cate {
    padding: 10px;
  }
  
  .category-header {
    flex-direction: column;
    text-align: center;
  }
  
  .category-info p {
    white-space: normal;
  }
  
  .category-stats {
    margin-top: 10px;
  }
}
</style>