/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var fs=require('fs');
var db=require('../models/db.js');
var formidable=require('formidable');
var mongoose=require('mongoose');
require('../models/comments_model')
var Comment=mongoose.model('Comment');
var Movie=mongoose.model('Movie');
var moment = require("moment");
exports.commentAdd=function(req,res){
    var productId = req.params.id;
    Movie.find({'movieName':productId}, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        req.session.commentProduct=product;
        res.render('commentAdd',{
            username:req.session.username,
            msg:req.session.msg,
            commentProduct:req.session.commentProduct[0]
        });
        // req.session.cart = cart;
        // res.redirect('/');
    })
};
exports.commentsShow=function(req,res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        var productId = req.params.id;
        Movie.find({'movieName': productId}, function (err, product) {
            if (err) {
                return res.redirect('/');
            }
            req.session.commentProduct = product;
            res.render('commentsShow', {
                username: req.session.username,
                msg: req.session.msg,
                commentProduct: req.session.commentProduct[0]
            });
        })
    }
};
exports.commentsShowAll=function(req,res) {
    Comment.find({}, function(err, result) {
        if (err) {
            return res.redirect('/backstage');
        }
        res.json(result);
    })
};
exports.myComments=function(req,res){
    res.render('myComments',{
        username:req.session.username,
        msg:req.session.msg
    })
};
exports.commentsCheck=function(req,res){
    res.render('commentsCheck',{
        adminname:req.session.adminname,
        msg:req.session.msg
    })
};
exports.commentsShowData=function(req,res){
    var productId = req.params.id;
    Comment.find({$or : [
        //多条件，数组
        {'commentMovie':productId},
        {'commentAuthor':productId}
    ]}, function(err, result) {
        if (err) {
            return res.redirect('/');
        }
        res.json(result);
    })
};

exports.commentAddData=function(req,res) {
    var date=moment().format("YYYY-MM-DD HH:mm:ss");
    var comment = new Comment({
        commentMovie: req.body.commentMovie,
        commentDate: date,
        commentAuthor:req.body.commentAuthor,
        commentInfo: req.body.commentInfo
    });
    comment.save(function (err) {
        if (err) {
            req.session.error = err;
        } else {
            res.json('1');
        }
    })
};
exports.commentsDelete=function(req,res){
    var productId = req.params.id;
    Comment.remove({_id:productId},function(err,docs){
        res.redirect('/commentsCheck');
    });
};
