/**
 * Created by 周杨 on 2016/11/2.
 */
var express=require('express');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var mongoStore=require('connect-mongo')(expressSession);
var mongoose=require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var userModel=require('./models/users_model.js');
var foodModel=require('./models/movies_model.js');
var dbUrl='mongodb://localhost:27017/cinema';
var conn=mongoose.connect(dbUrl);
var app=express();

app.engine('.html',require('ejs').__express);
app.set('views','./views');
app.set('view engine','html');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret:"mysecret",
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({
        mongooseConnection:mongoose.connection
    }),
    cookie:{ maxAge: 2 * 60 * 60 * 1000  }
}));
app.use(expressSession({
    // 假设每次登陆，就算会话存在也重新保存一次，默认true
    resave:false,
    // 强制保存未初始化的会话到存储器，默认true
    saveUninitialized:true,
    secret:'SECRET',
    cookie:{maxAge:60*60*1000},
    store:new mongoStore({
        url:dbUrl,
        //指定持久化到mongodb数据库中的collections的名字
        collection:'sessions'
    })
}));
require('./router/router.js')(app);
app.listen(3000);