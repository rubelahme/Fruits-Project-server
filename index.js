const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyna.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("assinment10").collection("assinment");
  const collectionOrders = client.db("assinment10").collection("order");

  app.post("/product", (req, res) => {
    const product = req.body;
    collection.insertOne(product).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/item", (req, res) => {
    collection.find().toArray((error, items) => {
      res.send(items);
    });
  });
  app.get("/items/:name", (req, res) => {
    collection.find({ name: req.params.name }).toArray((error, items) => {
      res.send(items[0]);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      console.log(result);
    });
  });

  app.post("/order", (req, res) => {
    const order = req.body;
    collectionOrders.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/allOrders", (req, res) => {
    collectionOrders
      .find({ email: req.query.email })
      .toArray((error, orders) => {
        res.send(orders);
      });
  });
});

app.listen(port);
