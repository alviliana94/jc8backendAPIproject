const nodemailer = require('nodemailer')
const path = require('path')
const Handlebars = require('handlebars')
const pdf = require('html-pdf')
const fs = require('fs')

const parentPath = path.join(__dirname, '../..');
const fileDir = path.join(parentPath, '/src/uploads');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "Oauth2",
        user: "alvilianasucianti@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

const createPdf = (username, name, email, fnSendEmail) => {
    var source =
    `<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<body>
    <div class="container">
        <p class="display-4 d-flex justify-content-between border-bottom">
            <span class="text-left">Invoice</span>
            <span class="text-right">#{{invoice}}</span>
        </p>
        <img src={{imgSrc}} alt="">
        <h1>Account Details</h1>
        <p>
            Username    : {{username}} <br>
            Name        : {{name}} <br>
            Email       : {{email}} <br>
            Plan        : <strong>Free</strong>
        </p>
    </div>
</body>

</html>`

var data = {
    "imgSrc" : "",
    "username" : `${username}`,
    "name" : `${name}`,
    "email" : `${email}`
}

var template = Handlebars.compile(source) // untuk compile teks html
var result = template(data) // menggabungkan object data dengan template html

fs.writeFileSync(`${fileDir}/result.html`, result) // path dan template

var htmls = fs.readFileSync(`${fileDir}/result.html`, 'utf8')

var options = {format: 'letter'}

pdf.create(htmls, options).toFile(`${fileDir}/result.html`, (err, result) => {
    if (err) return console.log(err.message);

    fnSendEmail()
    console.log("pdf berhasil dibuat");
})
}

const sendVerify = (username, name, email) => {
    transporter.sendMail(
        {
            from: 'rimu <rimu.social@gmail.com>',
            to: email,
            subject: "Verifikasi Email",
            html:<button><a href='https://rimu-sqlexpress.herokuapp.com/verify?username=${username}'>Klik untuk verifikasi</a></button>
        },
        (err, res) => {
            if (err) console.log(err.message);

            console.log("Email Sent");
            
        }
    );
};

module.exports = {
    sendVerify
}