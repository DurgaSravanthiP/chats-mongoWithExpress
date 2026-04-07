const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://localhost:27017/whatsapp');
};
let allChats = [{
        from: "neha",
        to: "priya",
        msg: "send me your exam papers",
        created_at: new Date(),
    },
    {
        from: "rohit",
        to: "mohit",
        msg: "tech me FS",
        created_at: new Date(),
    },
    {
        from: "amit",
        to: "sumit",
        msg: "all the best",
        created_at: new Date(),
    },
    {
        from: "anitha",
        to: "ramesh",
        msg: "bring some fruits",
        created_at: new Date(),
    },];
Chat.insertMany(allChats);