
'use strict';

const AWS = require('aws-sdk');
const moment = require('moment');
AWS.config.region = 'us-east-1';
var sns = new AWS.SNS();
var oldTime;
var nomAlert = 'none';  
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'au-cdbr-sl-syd-01.cleardb.net',
  user     : 'b07de0797f0dff',
  password : 'f769813c',
  database : 'ibmsl_4e7e44c949329d11f050'
});
const singleClick = 'nhap 1 cai';
const doubleClick = 'nhap 2 cai';
const longClick = 'nhap giu';
 const fiveSClick ='click sau 5 s';
// console.log((+moment("2018-05-18 18:11:05").format("ss")- +moment("2018-05-18 18:11:00").format("ss")))
connection.connect((err)=>{
	if(err) console.log(err)
	
);
connection.query(`select * from khachhangs`, function (error, results, fields){
		console.log(results)
	})

function sendSMS2(text,callback){


  var params = {
    Message: text,
    MessageStructure: 'string',
    TopicArn: 'arn:aws:sns:us-west-2:923161504510:nhom3topic'
  };

  sns.publish(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });
}
exports.handler = (event, context, callback) => {

// !!CHANGE THIS!! Your text to display goes in the single quotation marks below    
   
      
    if(event.clickType=="SINGLE"){
    	if(nomAlert==singleClick)
    		nomAlert= fiveSClick;
    	else 
    		nomAlert = singleClick;
    	sendSMS2(nomAlert);
      connection.query(`select * from iot`, function (error, results, fields) {
        if (error) throw error;
        
        if(results.length>0&&(+moment(new Date()).format("ss")- +moment(results[0].datetime).format("ss"))>=5 && 
          (+moment(new Date()).format("ss")- +moment(results[0].datetime).format("ss"))<=20)
        // console.log('The solution is: ', results[0].MaKH);
          {
            nomAlert=fiveSClick;
            
          }
          else nomAlert=singleClick;

          sendSMS2(nomAlert);
          connection.query(`update iot set datetime= "${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}"`, function(err,results){
            console.log("ok")
          })
      });
      else if((new Date()).getTime()-oldTime.getTime()>=3000){
        nomAlert=fiveSClick
      }
    }
  

if(event.clickType == "DOUBLE"){
    nomAlert = doubleClick;
    sendSMS2(nomAlert);
}

if(event.clickType == "LONG"){
    nomAlert = longClick;
    sendSMS2(nomAlert);
}
         
};