var nodemailer = require("nodemailer")
var url = require("url");
var http = require("http");
var fs = require("fs");
var mysql = require("mysql");

var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "nodedb",
    }
);

http.createServer(function (req, res) {
    var bilgi = url.parse(req.url, true).query;

    fs.readFile('mail.html', function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Dosya Bulunamadi");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();


    });
    if (bilgi.username && bilgi.password) {

        con.connect(function (err) {

            if (bilgi.username && bilgi.password) {
                var sql = "select username,password from user where username='" + bilgi.username + "' and password='" + bilgi.password + "'";

                con.query(sql, function (err, result) {
                    if (err) throw err;

                    if (err) throw err;
                    if (result.length > 0) {
                        console.log("giris basarılı");
                    }
                    else                    
                    console.log("giris hatalı");
                });

                var sql2 = "select username,password from user where username='" + bilgi.username + "'";
                con.query(sql2, function (err, result) {
                    
                    if (result.length>0) {
                        if (err) throw err;


                        if (bilgi.username == result[0].username)

                            var transporter = nodemailer.createTransport(
                                {

                                    service: "Hotmail",
                                    auth: {
                                        user: bilgi.username,
                                        pass: result[0].password
                                    }
                                }
                              
                            );

                        var mailOption =
                        {
                            from: bilgi.username,
                            to: bilgi.username,
                            subject: "Node.js ile mail atiyorum!",
                            text: "Hesabınıza girilmeye çalışılıyor haberiniz var mı?"
                        }
                        transporter.sendMail(mailOption, function (err, info) {
                            if (err) throw err;
                            console.log("mail gönderildi " + info);
                        });

                    }
                    });

           


        }
            }
            )
        

    }
}).listen(8080);