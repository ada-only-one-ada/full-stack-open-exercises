const express = require('express');
const app = express();
app.use(express.json());

const morgan = require('morgan');//Import Morgan
app.use(morgan('tiny')); //Configure Morgan to use the "tiny" preset
//GET /api/persons 200 223 - 2.256 ms
//HTTP method, Url, HTTP status code, size of response body in bytes, -, response time

//Define a Custom Token for Logging Request Body:
//morgan.token('type', function (req, res) { return req.headers['content-type'] })
//morgan(':method :url :status :res[content-length] - :response-time ms')
morgan.token('post-data', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return '';// Return an empty string for non-POST requests to avoid cluttering the log
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const numberOfPerson = persons.length;
    const currTime = Date();

    response.send(`
    <p>Phonebook has info for ${numberOfPerson} people</p>
    <p>${currTime}</p>
    `)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => {
        return person.id === id;
    });
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
    response.json(note);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * 100000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    } else {
        const name = body.name;
        const existed = persons.find(person => {
            return person.name === name;
        });
        if (existed) {
            return response.status(400).json({
                error: 'name must be unique'
            });
        }
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person);
    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


