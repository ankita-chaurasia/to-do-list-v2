//jshint esversion:6

// BOILERPLATE CODE

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// CONNECTION, SCHEMA, MODEL SETUP

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);

// GLOBALS 

const item1 = new Item({
  name: "Welcome to your Todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<--Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

// GET REQUESTS

app.get("/", async function(req, res) {

  const items = await Item.find();
  if(items.length === 0){
    Item.insertMany(defaultItems);
    res.redirect("/");
  }

  res.render("list", {listTitle: "Today", newListItems: items});

});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/:customListName", async function(req, res){

  const customListName = _.capitalize(req.params.customListName);

  const foundList = await List.findOne({name: customListName});
  if(foundList === null){
    const list = new List({
      name: customListName,
      items: defaultItems
    });
    await list.save();
    res.redirect("/" + customListName);
  } else {
    res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
  }

});

// POST REQUESTS

app.post("/", async function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");  
  }
  else{
    const foundList = await List.findOne({name: listName});
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  }
  
});

app.post("/delete", async function(req, res){

  const itemId = req.body.checkbox;
  console.log(itemId);
  const listName = req.body.listName;
  
  if(listName === "Today"){
    await Item.findByIdAndRemove(itemId);
    res.redirect("/");  
  }
  else{

    await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}});
    res.redirect("/" + listName);
  }

});

// PORT SETUP 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
