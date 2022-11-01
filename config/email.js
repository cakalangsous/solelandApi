const nodemailer = require("nodemailer")

exports.transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

exports.handlebarOptions = {
    viewEngine: {
        extname: ".handlebars", // handlebars extension
        partialsDir: "templates/", // location of your subtemplates aka. header, footer etc
        defaultLayout: false, // name of main template
    },
    viewPath: "templates/",
    extName: ".handlebars",
}
