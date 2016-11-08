/**
 * Created by 周杨 on 2016/11/2.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var UserSchema=new Schema({
    tel:{type:String,unique:true},
    sex:String,
    username:String,
    hashed_password:String
});
mongoose.model('User',UserSchema);