/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var express=require('express');
module.exports=function(app){
    var users=require('../controllers/users_controller.js');
    var movies=require('../controllers/movies_controller.js');
    app.use('/static',express.static('./static'))
        .use('./lib',express.static('./lib'));

    app.get('/',function(req,res){
        if(req.session.user){
            res.render('index',{
                username:req.session.username,
                msg:req.session.msg
            })
        }else{
            req.session.msg='请先登录 ！';
            res.redirect('/login');
        }
    });
    app.get('/movieAdd',function(req,res){
        res.render('movieAdd')
    });
    app.get('/movieUpdate',function(req,res){
        res.render('movieUpdate')
    });
    app.get('/signup',function(req,res){
        if(req.session.user){
            res.redirect('/');
        }
        res.render('signup',{msg:req.session.msg});
    });
    app.get('/login',function(req,res){
        if(req.session.user){
            res.redirect('/');
        }
        res.render('login',{msg:req.session.msg});
    });
    //退出登录
    app.get('/logout',function(req,res){
        //退出前销毁当前会话
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }
            res.redirect('/login');
        });
    });
    //注册路由，post请求
    app.post('/signup',users.signup);
    app.get('/show',movies.showMovies);
    app.get('/pages',movies.showPages);
    app.post('/movieSearch',movies.movieSearch);
    app.post('/movieAdd',movies.movieAdd);
    app.post('/user/update',users.updateUser);
    app.post('/user/delete',users.deleteUser);
    app.post('/login',users.login);
    app.get('/user/profile',users.getUserProfile);
};