/**
 * Created by 周杨 on 2016/10/25.
 */
var express=require('express');
var formidable=require('formidable');
var db = require("./model/db.js");
var ObjectId = require('mongodb').ObjectId;
var app=express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.get('/',function(req,res){
    res.render('index')
});
app.get('/drop',function(req,res){
    var id=req.query.id;
    db.deleteMany('comments',{'_id':ObjectId(id)},function(err,result){
        if(err){
            console.log('删除失败 ！');
            return;
        }
        res.json({'result':-1})
    })

});
app.post('/send',function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        db.insertOne('comments',
            {'username':fields.username,'words':fields.words,'time':new Date()},
            function(err,result){
              if(err){
                  res.json({'result':-1});
                  return;
              }
                res.json({'result':1});
            })

    });
});
app.get("/pages", function (req, res, next) {
    db.getAllCount("comments",function(count){
        res.json({
            "pageamount" : Math.ceil(count / 10)
        });
    });
});
app.get("/read", function (req, res, next) {
    var page=parseInt(req.query.page);
    db.find('comments',{},{'sort':{'time':-1},'pageamount':10,'page':page},function(err,result){
         res.json({'result':result})
    })
});
app.listen(3000);