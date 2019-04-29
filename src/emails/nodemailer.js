const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'alvilianasucianti@gmail.com',
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})

const mail = {
    from: 'rochafi Alvin <rochafi.dev@gmail.com>',
    to: 'reyhandty@gmail.com',
    subject: 'Hallow',
    html: '<h1>Hallow Mbak Reyhan</h1>'
}

transporter.sendMail(mail, (err, res) => {
    if(err) return console.log(err.message);

    console.log('mail berhasil terkirim')

})