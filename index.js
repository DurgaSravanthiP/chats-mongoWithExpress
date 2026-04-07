const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://localhost:27017/whatsapp');
};

let chat1 = new Chat({
    from: "neha",
    to: "priya",
    msg: "send me your exam papers",
    created_at: new Date(),
});

// chat1.save().then((res)=> {console.log(res);})
//             .catch((err)=>{console.log(err);});

app.get("/chats", async (req,res)=>{
    let chats = await Chat.find();
    // console.log(chats);
    // res.send("working");
    res.render("index.ejs",{chats});

});

// New Route
app.get("/chats/new", (req,res)=>{
    res.render("new.ejs");
});

// Create Route
app.post("/chats", (req,res)=>{
    let {from, to, msg} = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    // console.log(newChat);
    newChat.save().then((res)=>{console.log(res);})
                  .catch((err)=>{console.log(err);});

    // res.send("working");
    res.redirect("/chats");
});

// Edit Route
app.get("/chats/:id/edit", async (req,res) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
});

// Update Route
app.put("/chats/:id", async (req, res)=>{
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updatedChat= await Chat.findByIdAndUpdate(id, 
        {msg: newMsg}, 
        {runValidators: true, new: true},
    );
    // console.log(updatedChat);
    res.redirect("/chats");
});

// Destroy Route
app.delete("/chats/:id", async (req, res)=>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    // console.log(deletedChat);
    res.redirect("/chats");
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
