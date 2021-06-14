const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
var notesDB = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3000 ; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));
app.get("/api/notes", (req,res) => { res.json(notesDB)});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  const newNote = req.body;

  notesDB.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(notesDB));
  res.json(notesDB);
})

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  notesDB = notesDB.filter(notes => notes.id != id);

  fs.writeFileSync("./db/db.json", JSON.stringify(notesDB));
  res.json(notesDB);
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));