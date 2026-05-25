const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/fakewhatsapp");
}

let chat1 = new Chat({
  from: "neha",
  to: "priya",
  msg: "send me your exam papers",
  created_at: new Date(),
});

// chat1.save().then((res)=> {console.log(res);})
//             .catch((err)=>{console.log(err);});

app.get(
  "/chats",
  asyncWrap(async (req, res, next) => {
    let chats = await Chat.find();
    // console.log(chats);
    // res.send("working");
    res.render("index.ejs", { chats });
  }),
);

// New Route
app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "Page not Found");
  res.render("new.ejs");
});

// Create Route
app.post(
  "/chats",
  asyncWrap(async (req, res, next) => {
    let { from, to, msg } = req.body;

    let newChat = new Chat({
      from,
      to,
      msg,
      created_at: new Date(),
    });

    await newChat.save(); // ✅ only this

    res.redirect("/chats");
  }),
);

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

// New - Show Route
app.get(
  "/chats/:id",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      return next(new ExpressError(404, "Chat not Found"));
    }
    res.render("edit.ejs", { chat });
  }),
);

// Edit Route
app.get(
  "/chats/:id/edit",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  }),
);

// Update Route
app.put("/chats/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true },
    );
    // console.log(updatedChat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// Destroy Route
app.delete("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    // console.log(deletedChat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const handleValidationErr = (err) => {
  console.log("This was a Validation Error. Please follow rules");
  return err;
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") {
    // console.log("This was a Validation error. please follow rules");
    err = handleValidationErr(err);
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "someError Occurred" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
