const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oussema.dabboussi99@gmail.com",
    pass: "123456789QQq?",
  },
});
