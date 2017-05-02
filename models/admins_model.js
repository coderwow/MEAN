/**
 * Created by 周杨 on 2017/2/19.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var AdminSchema=new Schema({
    adminname:{type:String,unique:true},
    hashed_password:String
});
module.exports=mongoose.model('Admin',AdminSchema);