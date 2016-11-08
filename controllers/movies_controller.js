/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var fs=require('fs');
var db=require('../models/db.js');
var formidable=require('formidable');
var mongoose=require('mongoose');
var Movie=mongoose.model('Movie');
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
                res.send('添加成功 ！')
            }
        })
    });

};
exports.movieSearch=function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var marea=fields.moviearea;
        var mdate=fields.moviedate;
        var mtype=fields.movietype;
        Movie.find({
            $or : [ //多条件，数组
                {movieArea : marea},
                {movieDate : mdate},
                {movieType : mtype}
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
exports.showMovies=function(req,res){
    var page=parseInt(req.query.page);
    db.find('movies',{},{'pageamount':6,'page':page},function(err,result){
        res.json({'result':result})
    });
};
exports.showPages=function(req,res){
    db.getAllCount("movies",function(count){
        res.json({
            "pageamount" : Math.ceil(count / 6),
            "count":count
        });
    });
};
/*exports.login=function(req,res){
    User.findOne({tel:req.body.tel})
        .exec(function(err,user){
            //用户不存在
            if(!user){
                res.send('-2');
            }else if(user.hashed_password===md5(md5(req.body.password).substr(4, 7) + md5(req.body.password))){
                // 重新生成一个新的session
                req.session.regenerate(function(){
                    req.session.user=user.id;
                    req.session.username=user.username;
                    res.send('1')
                });
            }else{
                res.send('-1');
            }
            if(err){
                req.session.regenerate(function(){
                    req.session.msg=err;
                    res.redirect('./login');
                });
            }
        });
};
// /将用户信息以json格式返回
exports.getUserProfile=function(req,res){
    User.findOne({_id:req.session.user})
        .exec(function(err,user){
            if(!user){
                res.json(404,{err:'没有找到该用户 ！'});
            }else{
                res.json(user);
            }
        });
};
//更新用户信息
exports.updateUser=function(req,res){
    User.findOne({_id:req.session.user})
        .exec(function(err,user){
            user.set('email',req.body.email);
            user.set('color',req.body.color);
            user.save(function(err){
                if(err){
                    res.session.error=err;
                }else{
                    req.session.msg='更新成功 ！'
                }
                res.redirect('/user');
            });
        });
};

//删除用户
exports.deleteUser=function(req,res){
    User.findOne({_id:req.session.user})
        .exec(function(err,user){
            if(user){
                user.remove(function(err){
                    if(err){
                        req.session.msg=err;
                    }
                    req.session.destroy(function(){
                        res.redirect('/login');
                    });
                });
            }else{
                req.session.msg='User Not Found';
                req.session.destroy(function(){
                    res.redirect('/login');
                });
            }
        });
};*/

