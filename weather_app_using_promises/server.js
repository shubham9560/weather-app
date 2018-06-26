const express = require('express')
const hbs = require('hbs')
const axios = require('axios')
const bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','hbs')

app.get('/',(req,res)=>{
    res.render('index.hbs',{weather:null,err:null})
})

app.post('/',(req,res)=>{
    var weather=null;
    var err=null;
    var address = req.body.address;
    var encodedAddress = encodeURIComponent(address);
    var geocodeAddress = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

    axios.get(geocodeAddress).then((response)=>{
            if (response.data.results[0]===undefined){
                throw new Error('not able to fetch data')
            }

            else if(response.data.status === 'ZERO_RESULTS')
            {
                throw new Error('unable to find address')
            }
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var weathercode = `https://api.darksky.net/forecast/f4ad4e6b84f80e1068a64c87ed9bfba8/${lat},${lng}`;
        address=response.data.results[0].formatted_address
        //res.render('index.hbs',{weather:address,err:null})
        return axios.get(weathercode);
    }).then((response)=>{
        console.log('Temperature: ',response.data.currently.temperature);
        console.log('Apparent Temperature: ',response.data.currently.apparentTemperature);
        weather=`{
            Address:${address},
            Temperature:${(response.data.currently.temperature-32)*5/9} ,
            ApparentTemperature:${(response.data.currently.apparentTemperature-32)*5/9}
        }`
        console.log(weather);
        res.render('index.hbs',{weather:weather,err:null})

    }).catch((e)=>{
        "use strict";
        if(e.code === 'ENOTFOUND')
        {
            err='unable to connect to google api'
            console.log('unable to connect to google api');
        }
        else{
            err=e.message;
            console.log(e.message);
        }
        res.render('index.hbs',{weather:null,err:err})

    })

})

app.listen(8080,()=>console.log('server started at 8080'))