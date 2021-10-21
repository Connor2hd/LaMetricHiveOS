const express = require('express');
const request = require('request');
const http = require("http");
const app = express();

app.listen(process.env.PORT, () =>{
  console.log("Applet Started.  Listening on port: " + process.env.PORT);
});

app.get('/getEthHashrate', getEthHashrate);

function getEthHashrate(req, resMain){

  console.log("Attempting Request.");

  var apiToken = req.query.token;

  const options = {
      hostname: 'api2.hiveos.farm',
      path: '/api/v2/farms',
      headers: {
          Authorization: 'Bearer ' + apiToken
      }
  }

  var hashrate = 0;

  http.get(options, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          var hiveResponse = JSON.parse(body);
          console.log("Got a response: ", hiveResponse);

          if(hiveResponse.data != undefined){
              hashrate = hiveResponse.data[0].hashrates[0].hashrate / 1000;
          }

          let content = {
            "frames":[
              {"text":hashrate.toFixed(2), icon:"i11216"}
            ]
          };

          resMain.send(content);
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}
