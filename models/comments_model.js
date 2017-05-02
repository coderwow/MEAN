/**
 * Created by 周杨 on 2016/11/2.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var CommentSchema=new Schema({
    commentInfo:String,
    commentAuthor:String,
    commentMovie:String,
    commentDate:String
});
module.exports=mongoose.model('Comment',CommentSchema);