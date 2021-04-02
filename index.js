const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pv2sf.mongodb.net/bookshop?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("bookshop").collection("books");
  const orderCollection = client.db("OrderBook").collection("Order");
  app.post("/addorder", (req, res) => {
    orderCollection.insertOne(req.body);
  });
  app.get("/showOrderData", (req, res) => {
    orderCollection.find({ email: req.query.email }).toArray((err, order) => {
      res.send(order);
    });
  });

  app.post("/addbook", (req, res) => {
    collection.insertOne(req.body);
  });

  app.get("/showdata", (req, res) => {
    collection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      console.log(result);
    });
  });

  // perform actions on the collection object
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
