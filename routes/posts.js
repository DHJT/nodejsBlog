var express = require('express')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin
var User = require('../models/user.js')
var Post = require('../models/post.js')

// 首页
router.get('/',function(req,res,next) {
  res.render('index',{
    'title' : '用户主页'
  })
})

// 用户发布微博
router.get('/create',checkLogin,function (req,res,next) {
  res.render('say',{
    'title' : '发表微博'
  })
})

router.post('/',checkLogin,function (req,res) {
  var currentUser = req.session.user
  var post = new Post(currentUser.name,req.body.post,req.body.title,req.body.pv)
  post.save(function (err) {
    if (err) {
      req.flash('error',err)
      return res.redirect('/')
    }
    req.flash('success','发表成功')
    res.redirect('/posts/' + currentUser.name)
  })
})

// 展示用户发布的微博
router.get('/:user',function (req,res) {
  // 注意:req.params.user是从get请求的参数:user的值
  User.get(req.params.user,function (err,user) {
    if (!user) {
      req.flash('error','用户不存在')
      return res.redirect('/')
    }
    Post.get(user.name,function (err,posts) {
      if (err) {
        req.flash('error',err)
        return res.redirect('/')
      }

      res.render('user',{
        title : user.name,
        posts: posts
      })
    })
  })
})
module.exports = router
