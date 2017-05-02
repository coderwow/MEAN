/**
 * Created by 周杨 on 2017/2/17.
 */
/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var fs=require('fs');
var db=require('../models/db.js'); 
var formidable=require('formidable');
var mongoose=require('mongoose');
require('../models/orders_model')
var Order=mongoose.model('Order');
var moment = require("moment");
exports.orderAdd=function(req,res) {
    var date=moment().format("YYYY-MM-DD HH:mm:ss");
    var order = new Order({
        orderPerson: req.body.orderPerson,
        orderTel: req.body.orderTel,
        orderDate:date,
        orderDetail: req.body.orderDetail,
        orderStatus:'未确认',
        orderPrice:req.body.orderPrice
    });
    order.save(function (err) {
        if (err) {
            req.session.error = err;
        } else {
            req.session.cart=null;
            res.redirect('/');
        }
    })
};
exports.orderSearch=function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var marea=fields.orderarea;
        var mdate=fields.orderdate;
        var mtype=fields.ordertype;
        Conment.find({
            $or : [ //多条件，数组
                {orderArea : marea},
                {orderDate : mdate},
                {orderType : mtype}
            ]
        },function(err,docs){
            if(err){
                console.log('查询失败 ！');
                return;
            }
            res.json({'result':docs});
        })
    })
};
exports.orderDone=function(req,res){
    var productId = req.params.id;
    Order.update({_id:productId},{orderStatus:'已确认'}, function(error){
        console.log('success');
        res.redirect('/ordersCheck')
    });
};
exports.showPages=function(req,res){
    db.getAllCount("orders",function(count){
        res.json({
            "pageamount" : Math.ceil(count / 6),
            "count":count
        });
    });
};
exports.moviesDelete=function(req,res){
    var productId = req.params.id;
    Movie.remove({movieName:productId},function(err,docs){
        res.redirect('/backstage');
    });
};
