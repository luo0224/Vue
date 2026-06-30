import Mock from 'mockjs'

// 乐器分类接口
Mock.mock('/api/category/list', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '吉他类' },
      { id: 2, name: '钢琴类' },
      { id: 3, name: '民乐' },
      { id: 4, name: '打击乐' }
    ]
  }
})

// 全部乐器商品列表
Mock.mock('/api/goods/list', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '41寸原木民谣吉他', price: 699, categoryId: 1, type: '吉他', desc: '适合新手练习，原木材质，音色柔和通透' },
      { id: 2, name: '88键重锤电子钢琴', price: 2199, categoryId: 2, type: '钢琴', desc: '家用考级专用，88键配重仿钢琴手感' },
      { id: 3, name: '21弦考级实木古筝', price: 1399, categoryId: 3, type: '民乐', desc: '考级演奏款，泡桐木面板，音色清脆' },
      { id: 4, name: '4/4手工实木小提琴', price: 989, categoryId: 3, type: '弦乐', desc: '成人初学演奏，云杉面板手工打磨' },
      { id: 5, name: '五鼓三镲成人架子鼓', price: 2699, categoryId: 4, type: '打击乐', desc: '专业演出全套，静音鼓皮，居家练习不扰民' },
      { id: 6, name: '初学者尤克里里', price: 199, categoryId: 1, type: '吉他', desc: '23寸便携款，儿童成人入门乐器' }
    ]
  }
})

// 单个乐器详情接口
Mock.mock(/\/api\/goods\/\d+/, 'get', (req) => {
  const id = req.url.match(/\d+/)[0]
  const instrumentList = [
    { id: 1, name: '41寸原木民谣吉他', price: 699, categoryId: 1, type: '吉他', desc: '适合新手练习，原木材质，音色柔和通透' },
    { id: 2, name: '88键重锤电子钢琴', price: 2199, categoryId: 2, type: '钢琴', desc: '家用考级专用，88键配重仿钢琴手感' },
    { id: 3, name: '21弦考级实木古筝', price: 1399, categoryId: 3, type: '民乐', desc: '考级演奏款，泡桐木面板，音色清脆' },
    { id: 4, name: '4/4手工实木小提琴', price: 989, categoryId: 3, type: '弦乐', desc: '成人初学演奏，云杉面板手工打磨' },
    { id: 5, name: '五鼓三镲成人架子鼓', price: 2699, categoryId: 4, type: '打击乐', desc: '专业演出全套，静音鼓皮，居家练习不扰民' },
    { id: 6, name: '初学者尤克里里', price: 199, categoryId: 1, type: '吉他', desc: '23寸便携款，儿童成人入门乐器' }
  ]
  return {
    code: 200,
    data: instrumentList.find(item => item.id == id)
  }
})

// 新增乐器
Mock.mock('/api/goods/add', 'post', () => {
  return { code: 200, msg: '乐器商品添加成功' }
})
// 编辑乐器
Mock.mock('/api/goods/edit', 'post', () => {
  return { code: 200, msg: '乐器信息修改成功' }
})
// 删除乐器
Mock.mock('/api/goods/del', 'post', () => {
  return { code: 200, msg: '乐器删除成功' }
})