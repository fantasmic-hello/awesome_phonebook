require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :response-time :body"));

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/info", (request, response) => {
  Person.find({}).then((result) => {
    let answer = `<p>The phonebook has info on ${result.length} persons</p>`;
    response.send(answer);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    response.json(result);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  console.debug("request to update ", body);
  let person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  console.debug("unknown endpoint ", request.url);
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.debug(`Server running on ${PORT}`);
});
