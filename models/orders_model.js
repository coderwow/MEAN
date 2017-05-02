/**
 * Created by 周杨 on 2017/2/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var OrderSchema=new Schema({
    orderPerson:String,
    orderTel:String,
    orderDate:String,
    orderDetail:String,
    orderStatus:String,
    orderPrice:String
});
module.exports =mongoose.model('Order',OrderSchema);