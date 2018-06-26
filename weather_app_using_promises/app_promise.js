const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.argv;
argv._.push('new delhi');
var address = argv._[0]
var encodedAddress = encodeURIComponent(address);
var geocodeAddress = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

axios.get(geocodeAddress).then((response)=>{
    if(response.data.status === 'ZERO_RESULTS')
    {
        throw new Error('unable to find address')
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weathercode = `https://api.darksky.net/forecast/f4ad4e6b84f80e1068a64c87ed9bfba8/${lat},${lng}`;
    console.log('Address: ',response.data.results[0].formatted_address);
    return axios.get(weathercode);
}).then((response)=>{
    "use strict";
    console.log('Temperature: ',response.data.currently.temperature);
    console.log('Apparent Temperature: ',response.data.currently.apparentTemperature);


}).catch((e)=>{
    "use strict";
    if(e.code === 'ENOTFOUND')
    {
        console.log('unable to connect to google api');
    }
    else{
        console.log(e.message);
    }

})