/**
 * Created by 周杨 on 2016/11/2.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var MovieSchema=new Schema({
    movieName:{type:String,unique:true},
    movieType:String,
    moviePrice:Number,
    movieInfo:String,
    movieArea:String,
    movieDate:Date,
    movieStar:Number,
    moviePic:String
});
mongoose.model('Movie',MovieSchema);