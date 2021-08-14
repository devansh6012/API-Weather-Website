const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");

const app = express();

var query = "";
var temp = "";
var weatherDescription = "";
var imageUrl = "";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("",function(req,res){
    // res.sendFile(__dirname+ "/views/index.html");
    res.render("index");
})

app.get("/weather",function(req,res){
    
    res.render("weather",{place: query, desc: weatherDescription, temperature: temp, logo: imageUrl});
})

app.get("/about",function(req,res){
    res.render("about");
})

app.post("/weather",function(req,res){
    query = req.body.cityName;
    const apiKey = "6dbdbd4efa7206c9ebcc7b1df9569273";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            
            temp = weatherData.main.temp;
            weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            imageUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
            res.redirect("/weather")
        })
            
    })
})

app.listen(3000,function(){
    console.log("server is running");
})