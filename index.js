const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const express = require("express");
const http = require('http');
//student chat bot
const token = "5030251873:AAHdAZsdW4L8YFl_86GkWI9NNGx2Fl7farU";

const bot = new TelegramBot(token, {
    polling: true
});
const app = express();
const server = http.createServer(app);
app.use(express.urlencoded(true))
let URI = "mongodb://localhost:27017/botDb";
mongoose.connect(URI);
// , {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'), () => {
    console.log("error in connection to database");
});
db.once('open', function () {
    // we're connected!
    console.log(" connected to database");
});
const StudentIdSchema = new mongoose.Schema({
    StudentID: String,
    StudentName: String,
    PrevSection: String,
    Performance: Number,
    CurSec: String
});
const detailschema = new mongoose.Schema({
    SNO: Number,
    StudentName: String,
    FatherName: String,
    CollegeName: String,
    Course: String,
    Branch: String,
    Section: String,
    FatherNumber: Number,
    StudentNumber: Number,
    Email: String
});

const studentId = mongoose.model('studentids', StudentIdSchema);
const details = mongoose.model('details', detailschema);


bot.onText(/\/show (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    // const resp = match[1];
    const resp = match[1];

    studentId.findOne({
        StudentID: resp
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data) {

                let name = data.StudentName;
                console.log("Name is " + name);
                details.findOne({
                    StudentName: name
                }, function (err, data1) {
                    if (err) {
                        // console.log(err);
                        bot.sendMessage(chatId, "NOT FOUND");
                    } else {
                        console.log(data1);
                        if (data1 == null) {
                            bot.sendMessage(chatId, "ENTER CORRECT NAME");
                        } else {
                           
                             bot.sendMessage(chatId, data1.StudentName);
                            bot.sendMessage(chatId, data1.FatherName);
                            bot.sendMessage(chatId, data1.CollegeName);
                            bot.sendMessage(chatId, data1.Course);
                            bot.sendMessage(chatId, data1.Branch);
                            bot.sendMessage(chatId, data1.Section);
                            bot.sendMessage(chatId, data1.FatherNumber);
                            bot.sendMessage(chatId, data1.StudentNumber);
                            bot.sendMessage(chatId, data1.Email);
                            bot.sendMessage(chatId, data.StudentID);
                            bot.sendMessage(chatId, data.Performance);
                        }
                    }
                });
            } else {
                console.log(data);
                bot.sendMessage(chatId, "Student not found");
            }
        }
    });


});
const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
