const sgMail = require('@sendgrid/mail')
const sgAPIkey = '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'

sgMail.setApiKey(sgAPIkey)

// sgMail.send({
//   to: 'muhammadrizkipurba7@gmail.com',
//   from: 'muhammadrizki.dev@gmail.com',
//   subject: 'test kirim email',
//   text : 'Hello'
// })

const sendVerify = (username, name, email) => {
  sgMail.send({
    to: email,
    from: 'muhammadrizkipurba.dev@gmail.com',
    subject: 'Verifikasi email',
    html: `<h1><a href="http://localhost:2010/verify?username=${username}"> Klik untuk verifikasi email </a></h1>`
  })
}

module.exports = {
  sendVerify
}