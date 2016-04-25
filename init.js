var fs = require("fs"),
    http = require("superagent"),
    mailer = require("nodemailer"),
    Promise = require("bluebird");

var conf = require("./config");

Promise.promisifyAll(fs);
Promise.promisifyAll(http);

var mailer = mailer.createTransport({
  host: conf.smtp.host,
  auth: {
    user: conf.smtp.user,
    pass: conf.smtp.pass
  }
});

mailer.sendMailAsync = Promise.promisify(mailer.sendMail);
function sendMail(content) {
  console.log("Send mail")
  return mailer.sendMailAsync({
    from: conf.smtp.sender,
    to: conf.smtp.recipient,
    subject: "New rent available",
    html: content,
  })
}

module.exports = {
  sendMail: sendMail
};
