const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const myServer = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      fs.readFile("index.html", (err, data) => {
        if (!err) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        } else {
          res.writeHead(500);
          res.end("Server Error");
        }
      });
    } else if (req.url === "/data") {
      console.log("inside / route and Get rquest");
      fs.readFile("User.json", "utf8", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end("Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
      });
      //   res.end("welcome to home route");
    } else if (req.url == "/getdata") {
      fs.readFile("fetchdata.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Server Error");
        } else {
          console.log("sending allstudent.html file");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  } else {
    if (req.url === "/") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        //  console.log(chunk);
      });
      req.on("end", () => {
        let readdata = fs.readFileSync("User.json", "utf-8"); //data stored in string type

        if (!readdata) {
          // if file is empty add an empty array
          fs.writeFileSync("User.json", JSON.stringify([]));
        } else {
          //if file have already some data
          let jsonData = JSON.parse(readdata);
          let users = [...jsonData];
          console.log(users);

          let convertedbody = qs.decode(body);
          users.push(convertedbody);
          console.log(convertedbody);
          fs.writeFile("User.json", JSON.stringify(users), (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("userdata inserted succefuly");
            }
          });
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Registration successful!");
      });
    } else {
      res.writeHead(404);
      res.end("Not Found in post request");
    }
  }
});

myServer.listen(7000, () => console.log("server started!"));
