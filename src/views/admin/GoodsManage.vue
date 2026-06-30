<template>
  <div class="goods-admin">
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

    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索商品名称" clearable @keyup.enter="handleSearch">
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      <el-select v-model="filterCategory" placeholder="筛选分类" clearable>
        <el-option label="吉他" value="吉他"/>
        <el-option label="钢琴" value="钢琴"/>
        <el-option label="民乐" value="民乐"/>
        <el-option label="弦乐" value="弦乐"/>
        <el-option label="打击乐" value="打击乐"/>
      </el-select>
      <el-button type="primary" @click="openDialog">新增乐器商品</el-button>
    </div>

    <div class="goods-grid">
      <el-card 
        v-for="item in filteredGoods" 
        :key="item.id" 
        class="goods-card"
      >
        <div class="goods-image">
          <img :src="item.image" :alt="item.name" />
          <el-tag v-if="item.tag" :type="getTagType(item.tag)" size="small" class="goods-tag">{{ item.tag }}</el-tag>
        </div>
        <h4 class="goods-name">{{ item.name }}</h4>
        <p class="goods-desc">{{ item.desc }}</p>
        <div class="goods-info">
          <span class="goods-price">¥{{ item.price }}</span>
          <span class="goods-category">{{ item.type }}</span>
        </div>
        <div class="goods-actions">
          <el-button size="small" @click="edit(item)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(item.id)">删除</el-button>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="show" title="乐器商品编辑" width="600px">
      <el-form :model="form">
        <el-form-item label="乐器名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="form.desc" type="textarea" :rows="3"/>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model.number="form.price" prefix="¥"/>
        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model.number="form.originalPrice" prefix="¥"/>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.type">
            <el-option label="吉他" value="吉他"/>
            <el-option label="钢琴" value="钢琴"/>
            <el-option label="民乐" value="民乐"/>
            <el-option label="弦乐" value="弦乐"/>
            <el-option label="打击乐" value="打击乐"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-select v-model="form.tag">
            <el-option label="热门" value="热门"/>
            <el-option label="新品" value="新品"/>
            <el-option label="秒杀" value="秒杀"/>
            <el-option label="促销" value="促销"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            action="#"
            :show-file-list="false"
            :before-upload="handleImageUpload"
            accept="image/*"
          >
            <el-image 
              v-if="form.image" 
              :src="form.image" 
              style="width: 150px; height: 150px; object-fit: cover;"
            />
            <el-button v-else>上传图片</el-button>
          </el-upload>
          <div v-if="!form.image" style="margin-top:10px;color:#999;font-size:12px">
            或输入图片URL:
            <el-input v-model="form.image" style="width:200px;margin-top:5px"/>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="show=false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const showMobileMenu = ref(false)
const show = ref(false)
const searchKeyword = ref('')
const filterCategory = ref('')
const form = ref({ id:"", name:"", price:"", originalPrice:"", type:"", desc:"", tag:"", image:"" })

const list = ref([
  { id: 1, name: '41寸原木民谣吉他', price: 699, originalPrice: 899, type: '吉他', desc:"适合新手练习，音色柔和，做工精致", tag:"热门", image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=400&h=300&fit=crop' },
  { id: 2, name: '88键重锤电子钢琴', price: 2199, originalPrice: 2599, type: '钢琴', desc:"专业级重锤手感，多音色选择", tag:"热门", image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },
  { id: 3, name: '21弦考级实木古筝', price: 1399, originalPrice: 1699, type: '民乐', desc:"兰考泡桐木面板，音色纯正", tag:"新品", image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop' },
  { id: 4, name: '4/4手工实木小提琴', price: 989, originalPrice: 1289, type: '弦乐', desc:"手工制作，音质优美", tag:"", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 5, name: '五鼓三镲成人架子鼓', price: 2699, originalPrice: 3299, type: '打击乐', desc:"专业配置，音色饱满", tag:"促销", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 6, name: '初学者尤克里里', price: 199, originalPrice: 299, type: '吉他', desc:"小巧便携，儿童成人入门首选", tag:"秒杀", image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400&h=300&fit=crop' },
  { id: 7, name: '38寸面单吉他', price: 899, originalPrice: 1199, type: '吉他', desc:"面单工艺，音色出众", tag:"", image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop' },
  { id: 8, name: '41寸电箱吉他', price: 1299, originalPrice: 1599, type: '吉他', desc:"内置拾音器，演出必备", tag:"", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 9, name: '儿童小吉他 23寸', price: 299, originalPrice: 399, type: '吉他', desc:"专为儿童设计，安全环保", tag:"", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 10, name: '旅行吉他 34寸', price: 599, originalPrice: 799, type: '吉他', desc:"小巧轻便，旅行伴侣", tag:"", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 11, name: '全单板民谣吉他', price: 1899, originalPrice: 2299, type: '吉他', desc:"全单工艺，专业演奏级", tag:"新品", image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&h=300&fit=crop' },
  { id: 12, name: '便携式电钢琴', price: 1599, originalPrice: 1999, type: '钢琴', desc:"可折叠设计，方便携带", tag:"", image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },
  { id: 13, name: '专业演奏电钢琴', price: 4599, originalPrice: 5299, type: '钢琴', desc:"舞台演出级，音色细腻", tag:"新品", image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },
  { id: 14, name: '竹笛套装 成人', price: 299, originalPrice: 399, type: '民乐', desc:"专业竹笛，音色通透", tag:"", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 15, name: '扬琴专业级', price: 2199, originalPrice: 2699, type: '民乐', desc:"专业演奏用扬琴", tag:"", image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop' },
  { id: 16, name: '儿童小提琴 1/4', price: 399, originalPrice: 599, type: '弦乐', desc:"适合4-6岁儿童", tag:"", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 17, name: '大提琴成人专业', price: 2999, originalPrice: 3599, type: '弦乐', desc:"专业级大提琴", tag:"新品", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 18, name: '专业电爵士鼓', price: 4599, originalPrice: 5299, type: '打击乐', desc:"电子鼓套装，多种鼓组", tag:"", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 19, name: '卡宏鼓 木质', price: 399, originalPrice: 499, type: '打击乐', desc:"木箱鼓，手拍鼓", tag:"", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 20, name: '非洲手鼓', price: 259, originalPrice: 359, type: '打击乐', desc:"山羊皮鼓面，音色温暖", tag:"", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' }
])

const filteredGoods = computed(() => {
  let result = list.value
  if (searchKeyword.value) {
    result = result.filter(item => item.name.includes(searchKeyword.value))
  }
  if (filterCategory.value) {
    result = result.filter(item => item.type === filterCategory.value)
  }
  return result
})

const openDialog = () => {
  form.value = { id:"", name:"", price:"", originalPrice:"", type:"", desc:"", tag:"", image:"" }
  show.value = true
}

const edit = (row) => {
  form.value = {...row}
  show.value = true
}

const save = () => {
  if(!form.value.name || !form.value.price) {
    ElMessage.warning('请填写商品名称和价格')
    return
  }
  if(!form.value.id) {
    list.value.push({...form.value, id:Date.now()})
  }
  show.value = false
  ElMessage.success("商品保存成功")
}

const del = (id) => {
  list.value = list.value.filter(item=>item.id != id)
  ElMessage.success("删除乐器成功")
}

const handleSearch = () => {}

const getTagType = (tag) => {
  const types = {
    '热门': 'danger',
    '新品': 'primary',
    '秒杀': 'warning',
    '促销': 'success'
  }
  return types[tag] || 'info'
}

const handleImageUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.image = e.target.result
  }
  reader.readAsDataURL(file)
  return false
}
</script>

<style scoped>
.goods-admin {
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

.search-bar {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.search-bar .el-input {
  flex: 1;
  min-width: 200px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.goods-card {
  padding: 15px;
  transition: all 0.3s ease;
}

.goods-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.goods-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 15px;
  background: #f5f5f5;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.goods-card:hover .goods-image img {
  transform: scale(1.05);
}

.goods-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}

.goods-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #909399;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.goods-price {
  font-size: 22px;
  font-weight: bold;
  color: #f56c6c;
}

.goods-category {
  font-size: 13px;
  color: #606266;
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 4px;
}

.goods-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  .goods-admin {
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
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar .el-input {
    min-width: 100%;
  }
  
  .goods-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }
  
  .goods-image {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .goods-admin {
    padding: 10px;
  }
  
  .goods-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .goods-image {
    height: 180px;
  }
}
</style>