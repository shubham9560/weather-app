const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
let app = express();
let address=null;

app.set('view engine','hbs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('index.hbs',{weather:null,err:null})
});

app.post('/',(req,res)=>{

    address=req.body.address;
    let encodedAddress = encodeURIComponent(address);

    request({
        url:`http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
        json:true
        },
        (error,response,body)=>{
        if (error){
            err='unable to connect to  google api';
            res.render('index.hbs',{weather:null,err})
        }
        else if(body.results[0]===undefined||body.status==='ZERO_RESULTS'){
            err='unable to fetch data';
            res.render('index.hbs',{weather:null,err})
        }
        else {
            let google = body.results[0];
            address = google.formatted_address;
            let lat = google.geometry.location.lat;
            let lng = google.geometry.location.lng;
            request({
                url:`https://api.darksky.net/forecast/f4ad4e6b84f80e1068a64c87ed9bfba8/${lat},${lng}`,
                json:true
            },(error,response,body)=>{
                if(error){
                    err = 'unable to connect to weather api';
                    res.render('index.hbs',{weather:null,err})
                }
                else{
                    let weatherData = body.currently;
                    weather = `{
                    Address : ${address},
                    Temperature : ${weatherData.temperature},
                    ApparentTemperature : ${weatherData.apparentTemperature}
                    }`;
                    res.render('index.hbs',{weather,err:null})
                }
            });
        }
    });
});

//app.listen(3000,()=>console.log('server started at port 3000'));
app.listen(8080,()=>console.log('server started at port 8080'));
