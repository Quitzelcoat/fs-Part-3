const morgan = require("morgan");
const express = require("express");
const app = express();

const phonebook = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.use(morgan("tiny"));

app.use(express.json());

morgan.token("body", (req) => {
  JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// all data
app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

// date and length
app.get("/info", (req, res) => {
  const currentTime = new Date().toString();
  const entriesCount = phonebook.length;

  res.send(`
      <p>Phonebook has info for ${entriesCount} people</p>
      <p>${currentTime}</p>
    `);
});

// each person by id
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((entry) => entry.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: "Person not found" });
  }
});

// Delete entity
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((books) => books.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).send({ error: "Name and number are missing" });
  }

  const nameExists = phonebook.some((entry) => entry.name === name);
  if (nameExists) {
    return res.status(400).send({ error: "name must be unique" });
  }

  const id = Math.random().toString(36).slice(2, 11);

  const newPerson = { id, name, number };

  phonebook.push(newPerson);

  res.status(201).json(newPerson);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
