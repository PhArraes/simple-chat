const { MongoClient } = require("mongodb").MongoClient;

const mongoose = require("mongoose");
let model = null;

function getMessageModel() {
  if (!model)
    model = mongoose.model(
      "Message",
      new mongoose.Schema({
        topic: String,
        partition: Number,
        timestamp: Number,
        key: String,
        value: String,
      })
    );
  return model;
}

async function insertMessage(message) {
  try {
    const database = await mongoose.connect("mongodb://localhost/simple_chat", {
      useNewUrlParser: true,
    });
    const Model = getMessageModel();
    const messageModel = new Model(message);
    return await messageModel.save();
  } finally {
  }
}

module.exports = { insertMessage };
