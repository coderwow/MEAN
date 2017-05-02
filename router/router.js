/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var express=require('express');
var db=require('../models/db.js');
var Cart = require('../models/cart');
module.exports=function(app){
    var users=require('../controllers/users_controller.js');
    var movies=require('../controllers/movies_controller.js');
    var comments=require('../controllers/comments_controller.js');
    var orders=require('../controllers/orders_controller.js');
    app.use('/static',express.static('./static'))
        .use('./lib',express.static('./lib'));

    app.get('/',function(req,res){
        if(req.session.user){
            if(!req.session.cart){
                req.session.cart={totalNum:0};
            }
            res.render('index',{
                username:req.session.username,
                msg:req.session.msg,
                num:req.session.cart.totalNum
            })
        }else{
            req.session.msg='请先登录 ！';
            res.redirect('/login');
        }
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
    app.get('/adminLoginout',function(req,res){
        //退出前销毁当前会话
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }
            res.redirect('/admin');
        });
    });
    app.get('/shoppingCart',function(req,res){
        if(!req.session.user){
            res.redirect('/');
        }else{
            res.render('shoppingCart',{
                username:req.session.username,
                msg:req.session.msg,
                num:req.session.cart.totalNum
            })
        }
    });
    app.get('/ordersData',function(req,res){
        db.find('orders',{},function(err,result){
            res.json({'result':result});
        });
    });
    app.get('/ordersDataNot',function(req,res){
        db.find('orders',{orderStatus:'未确认'},function(err,result){
            res.json({'result':result});
        });
    });
    app.get('/ordersDataOk',function(req,res){
        db.find('orders',{orderStatus:'已确认'},function(err,result){
            res.json({'result':result});
        });
    });
    app.get('/cartsData',function(req,res){
        if (!req.session.cart) {
            return res.json({
                products: null
            });
        }
        var cart = new Cart(req.session.cart);
        res.json({
            products: cart.generateArray(),
            totalPrice: cart.totalPrice
        })
    });
    app.get('/orderAdd',function(req,res){
        res.render('orderAdd',{
            username:req.session.username,
            msg:req.session.msg,
            tel:req.session.tel,
            num:req.session.cart.totalNum
        })
    });
    app.get('/orderDetail',function(req,res){
        res.render('orderDetail',{
            username:req.session.username,
            msg:req.session.msg
            // num:req.session.cart.totalNum
        })
    });
    app.get('/backstage',function(req,res){
        res.render('backstage',{
            adminname:req.session.adminname,
            msg:req.session.msg
        })
    });
    app.get('/add-to-cart/:id',movies.addCarts);
    app.get('/downProducts/:id',movies.downProducts);
    app.get('/addProducts/:id',movies.addProducts);
    //注册路由，post请求
    app.post('/signup',users.signup);
    app.get('/show',movies.showMovies);
    app.get('/pages',movies.showPages);
    app.post('/movieSearch',movies.movieSearch);
    app.post('/orderAdd',orders.orderAdd);
    app.post('/movieAdd',movies.movieAdd);
    app.post('/user/update',users.updateUser);
    app.post('/user/delete',users.deleteUser);
    app.post('/login',users.login);
    app.get('/user/profile',users.getUserProfile);
    app.get('/movieAdd',function(req,res){
        res.render('movieAdd')
    });
    app.get('/admin',function(req,res){
        res.render('adminLogin')
    });
    app.get('/adminSignUp',function(req,res){
        res.render('adminSignUp')
    });
    app.get('/ordersCheck',function(req,res){
        res.render('ordersCheck',{
            adminname:req.session.adminname,
                msg:req.session.msg
        })
    });
    app.get('/myComments',comments.myComments);
    app.get('/commentAdd/:id',comments.commentAdd);
    app.get('/commentsShow/:id',comments.commentsShow);
    app.post('/commentsShow/:id',comments.commentsShowData);
    app.post('/commentAddData',comments.commentAddData);
    app.post('/admin',users.adminLogin);
    app.post('/adminSignUp',users.adminSignUp);
    app.get('/movieUpdate/:id',movies.moviesUpdate);
    app.get('/orderDone/:id',orders.orderDone);
    app.get('/commentsCheck',comments.commentsCheck);
    app.post('/commentsShowAll',comments.commentsShowAll);
    app.post('/movieUpdate/:id',movies.moviesUpdateData);
    app.get('/movieDelete/:id',movies.moviesDelete);
    app.get('/commentsDelete/:id',comments.commentsDelete);
};