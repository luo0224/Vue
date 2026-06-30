import Mock from 'mockjs'
// 用户前台登录
Mock.mock('/api/user/login','post',(req)=>{
  const body = JSON.parse(req.body)
  if(body.username === "user" && body.password === "123456"){
    return { code:200, token:"user123456", msg:"登录成功" }
  }else{
    return { code:400, msg:"账号密码错误" }
  }
})
// 管理员后台登录
Mock.mock('/api/admin/login','post',(req)=>{
  const body = JSON.parse(req.body)
  if(body.username === "admin" && body.password === "admin123"){
    return { code:200, token:"admin666888", msg:"登录成功" }
  }else{
    return { code:400, msg:"管理员账号密码错误" }
  }
})