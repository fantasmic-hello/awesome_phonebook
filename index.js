const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

let data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(express.static('dist'))
app.use(morgan(":method :url :response-time :body"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(data);
});

app.get("/api/info", (request, response) => {
  const date = new Date();
  let answer = `<p>The phonebook has info on ${data.length} persons</p>
    <p>${date}</p>
    `;
  response.send(answer);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = data.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  data = data.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  const uuid = String(Math.floor(Math.random() * 1000));
  person.id = uuid;
  data = data.concat(person);
  response.json(person);
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.debug(`Server running on ${PORT}`);
});
