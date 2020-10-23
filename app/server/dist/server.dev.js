"use strict";

var http = require('http');

var fs = require("fs"); //reads files


var express = require('express');

var path = require('path');

var _require = require('express'),
    response = _require.response;

var _require2 = require('body-parser'),
    json = _require2.json;

var app = express(); // let users = fs.readFile("../database/user.json");

var users = {
  username: "jerry137",
  password: "123456",
  name: "Jerry Smith",
  UID: "c117",
  watchlist: ["AAL", "TSLA", "FB", "SHOP", "AMD"],
  ownedStocks: [{
    name: "American Airlines Group Inc.",
    quote: "12.74",
    symbol: "AAL",
    share: 20
  }],
  activity: ["Brought 26 shares of TSLA", "Sold 26 shares of AAL"],
  account: {
    accountName: "TFSA",
    cashBalance: 4048.28,
    investmentBalance: "0"
  },
  balanceGrowth: "-20%"
};
app.use(express["static"](path.join(__dirname, '../')));
app.get('/', function (request, response) {
  console.log(request.url);

  if (request.url === "/" || request.url === "../index") {
    fs.readFile("../index.html", function (err, data) {
      if (err) {
        response.statusCode = 500;
        response.write("Server error.");
        response.end();
        return;
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.write(data.toString());
      response.end();
    });
  }
});
app.get('/getBalance', function (request, response) {
  var data = users.account.cashBalance;
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/JSON");
  console.log("\nClient ".concat(users.username, " balance info sent.\n"));
  response.write(data.toString());
  response.end();
});
app.get('/getAccount', function (request, response) {
  var data = JSON.stringify(users);
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/JSON");
  console.log("\nClient ".concat(users.username, " account info sent.\n"));
  response.write(data);
  console.log(users);
  response.end();
});
app.post('/authentication', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    var username = data.username;
    var password = data.password;
    authenticate(username, password);
    response.end();
  });

  function authenticate(username, password) {
    if (users.username === username && users.password === password) {
      console.log("\nClient ".concat(username, " authenticated succesfully.\n"));
      response.write("/html/dashboard.html");
    } else {
      response.write("false");
      console.log("\nClient ".concat(username, " provided invalid login.\n"));
    }
  }
});
app.post('/updateBalance', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    users.account["cashBalance"] = data;
    console.log("\nClient ".concat(users.username, " balance updated to ").concat(data, ".\n"));
    response.end();
  });
});
app.get('/stock-data', function (request, response) {
  fs.readFile("../database/stocks/data.json", function (err, file) {
    var lis = JSON.parse(file);
    var data = [];
    response.setHeader("Content-Type", "application/JSON");

    for (var j = 0; j < users.watchlist.length; j++) {
      item = users.watchlist[j];
      data.push(lis[item]);
    }

    console.log(data);
    response.write(JSON.stringify(data));
    response.end();
  });
});
app.listen(3000);
console.log('\nServer running at http://127.0.0.1:3000/\n');