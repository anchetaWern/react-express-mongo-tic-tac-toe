const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const DB_PASSWORD = "";

const uri = `mongodb+srv://wern:${DB_PASSWORD}@cluster0-66qtd.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("connected!");

	const scores = new mongoose.Schema({
		name: String,
		score: Number
	});

	const Person = mongoose.model("Person", scores);

	app.get("/", (req, res) => {
		return res.send("all is well...");
	});

	app.get("/scores", (req, res) => {
		Person.find((err, people) => {
			if (err) {
				throw new Error("BROKEN");
			}
			return res.send(people);
		});
	});

	app.post("/scores/create", (req, res) => {
		const { name, score } = req.body;

		const human = new Person({ name, score });

		human.save((err, obj) => {
			if (err) {
				throw new Error("BROKEN");
			}

			return res.send(obj);
		});
	});
});

const port = process.env.PORT || 5000;
app.listen(port);
