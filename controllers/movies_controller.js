/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var fs=require('fs');
var db=require('../models/db.js');
var formidable=require('formidable');
var mongoose=require('mongoose');
var Movie=mongoose.model('Movie');
var Cart = require('../models/cart');
var request = require('request');
var bodyParser = require('body-parser');
exports.movieAdd=function(req,res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "/../static/images/films";
    form.parse(req, function(err, fields, files) {
        var movie = new Movie({movieName: fields.mname});
        movie.set('movieType', fields.mtype);
        movie.set('movieArea', fields.marea);
        movie.set('movieDate', fields.mdate);
        movie.set('movieInfo', fields.minfo);
        movie.set('moviePrice', fields.mprice);
        movie.set('moviePic', files.mpic.name);
        movie.set('movieStar', fields.mstar);
        var oldpath =  files.mpic.path;
        //新的路径由三个部分组成：时间戳、随机数、拓展名
        var newpath = __dirname + "/../static/images/films/"+files.mpic.name;
        //改名
        fs.rename(oldpath,newpath,function(err){
            if(err){
                throw Error("改名失败");
            };
        });
        movie.save(function (err) {
            if (err) {
                console.log('添加失败 ！');
                return;
            } else {
                res.redirect('/backstage');
            }
        })
    });

};
exports.movieSearch=function(req,res) {
    Movie.find({
        $or : [ //多条件，数组
            {movieArea : req.body.moviearea},
            {movieDate : req.body.moviedate},
            {movieType : req.body.movietype}
        ]
    },function(err,docs){
        if(err){
            console.log('查询失败 ！');
            return;
        }
        res.json({'result':docs});
    });
};
exports.showMovies=function(req,res){
    var page=parseInt(req.query.page);
    db.find('movies',{},{'pageamount':6,'page':page},function(err,result){
        res.json({'result':result})
    });
};
exports.addCarts=function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Movie.findById(productId, function(err, product) {
            if (err) {
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect('/');
        })
    }
    
};
exports.downProducts=function(req,res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Movie.findById(productId, function(err, product) {
        cart.down(product, product.id);
        req.session.cart = cart;
        res.redirect('/shoppingCart');
    })
};
exports.addProducts=function(req,res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Movie.findById(productId, function(err, product) {
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/shoppingCart');
    })
};
exports.showPages=function(req,res){
    db.getAllCount("movies",function(count){
        res.json({
            "pageamount" : Math.ceil(count / 6),
            "count":count
        });
    });
};
exports.moviesUpdate=function(req,res){
    var productId = req.params.id;
    res.render('movieUpdate',{movieName:productId,adminname:req.session.adminname});
};
exports.moviesUpdateData=function(req,res){
    var productId = req.params.id;
    Movie.remove({movieName:productId},function(err,docs){
        var form = new formidable.IncomingForm();
        form.uploadDir = __dirname + "/../static/images/films";
        form.parse(req, function(err, fields, files) {
            var movie = new Movie({movieName: fields.mname});
            movie.set('movieType', fields.mtype);
            movie.set('movieArea', fields.marea);
            movie.set('movieDate', fields.mdate);
            movie.set('movieInfo', fields.minfo);
            movie.set('moviePrice', fields.mprice);
            movie.set('moviePic', files.mpic.name);
            movie.set('movieStar', fields.mstar);
            var oldpath =  files.mpic.path;
            //新的路径由三个部分组成：时间戳、随机数、拓展名
            var newpath = __dirname + "/../static/images/films/"+files.mpic.name;
            //改名
            fs.rename(oldpath,newpath,function(err){
                if(err){
                    throw Error("改名失败");
                };
            });
            movie.save(function (err) {
                if (err) {
                    console.log('修改失败 ！');
                    return;
                } else {
                    res.redirect('/backstage');
                }
            })
        });
    });
};
exports.moviesDelete=function(req,res){
    var productId = req.params.id;
    Movie.remove({movieName:productId},function(err,docs){
        res.redirect('/backstage');
    });
};