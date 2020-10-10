const fetch = require("node-fetch");

var express = require('express');
var imgur=require("imgur")
var app = express();
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
const { send } = require("process");

var port=process.env.PORT || 5000;
const datafile=__dirname + "/" + "data.json";

const client_id="a19de2195df8de9"
const client_secret="e8c869f4d8662129ae9fdeea7b5863a1bb85adbd"

imgur.setClientId(client_id);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

console.log("server work");


function upload_image(base64,callback) {
    //var imgurFavicon = ;
    //console.log(base64)
    imgur.uploadBase64(base64)
        .then(function (json) {
            console.log(json.data.link);
            callback(json.data.link)
        })
        .catch(function (err) {
            console.error(err.message);
        });
        
    
}
//var smlpe="iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmUlEQVQ4je2TsQ3CMBBFnxMa08WR2IQKJskIUNwMZAcYwWIQMs65JCUpEEIYW4pJy6v+6e6+/hVnnGsAzsCBMi7AsbbW/rIMsAU2xrnmkeruuzW7zgIw+JGbv6fGQpWzfy3HOsJlDQY/AlCv3jpF9oS5ZBOICKoB1YCIlCdQDR9127qyBHP5Gyw3CBXPr/qi709JHXE1S995AsqoJu8x78GsAAAAAElFTkSuQmCC"

//console.log(image_1)
//upload_image(image_1,(indata)=>console.log(indata))
function activity_data(dosome,inreq)
{
	var activity_form={
		time:Date.now(),
        doing:dosome,
		req_data:"",
	};

	var req_data={
		
		x_forwarded_for :inreq.header('x-forwarded-for'),
		ip : inreq.ip,

	};

	activity_form["req_data"]=req_data
	
	return activity_form
}
app.get("/",function (req,res) {
    
    res.sendFile(__dirname+"/index.html")
})
app.get("/"+"js_package.js",function (req,res) {
    
    res.sendFile(__dirname+"/js_package.js")
})
app.get("/"+"css_package.css",function (req,res) {
    
    res.sendFile(__dirname+"/css_package.css")
})

app.get('/get_data',  function (req, res) {
    var start = req.query.start
    var number=req.query.number
    start=parseInt(start)
    number=parseInt(number)
    fs.readFile(datafile, 'utf8', function (err, data) {

    data=JSON.parse(data)
    if (start+number+1>data["data"].length) {
        start=0
        
    }
    //save data
    //data["activity"].push(activity_data("read "+start.toString()+(start+number).toString(),req));

    fs.writeFile(datafile,JSON.stringify(data, null, "\t"), function (err) {
        var output=[]
        for (let index = start; index < start+ number; index++) {
            output.push(data["data"][index])
            
        }
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(output))
    });

    console.log("read data");


    });
})
app.post('/add_data', function (req, res) {
    //console.log("add")
    //var add_data = req.query.add_data

    console.log("add")
    var add_data=req.body
    //console.log(add_data)
    //res.end("123")
    
    //console.log(add_data)
    fs.readFile(datafile, 'utf8', function (err, data) {

    //add_data=JSON.parse(add_data)
    //console.log(add_data["base64"])
    data=JSON.parse(data)
    upload_image(add_data["base64"],function (link) {
        //console.log(add_data["base64"])
        delete add_data["base64"]
        add_data["image_url"]=link
        data["data"].push(add_data)
        
        
        fs.writeFile(datafile,JSON.stringify(data, null, "\t"), function (err) {
            console.log("ok")
            res.end("ok")
        });
        
    })
    
    //save data
    //data["activity"].push(activity_data("add_data",req));
    
    console.log("newdata");


    });
    
})
var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port
  
    console.log("应用实例，访问地址为 http://localhost:%s", port)
    //console.log("应用实例，访问地址为 http://%s:%s",host, port)
  
  })
