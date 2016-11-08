/**
 * Created by 周杨 on 2016/11/2.
 */
var crypto=require('crypto');
var mongoose=require('mongoose');
var User=mongoose.model('User');
function md5(pwd){
    return crypto.createHash('md5').update(pwd).digest('base64').toString();
}
exports.signup=function(req,res) {
    var user = new User({tel: req.body.tel});
    user.set('hashed_password', md5(md5(req.body.password).substr(4, 7) + md5(req.body.password)));
    user.set('sex', req.body.sex);
    user.set('username', req.body.username);
    user.save(function (err) {
        if (err) {
            req.session.error = err;
            res.redirect('./signup');
        } else {
            req.session.user = user.id;
            req.session.username = user.username;
            req.session.msg = '欢迎你 ，' + user.username;
            res.redirect('/');
        }
    })
};
exports.login=function(req,res){
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
};

