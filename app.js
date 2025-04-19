const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Read todos from file
function getTodos() {
    try {
        const data = fs.readFileSync('todos.json');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Save todos to file
function saveTodos(todos) {
    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
}

// Homepage
app.get('/', (req, res) => {
    const todos = getTodos();
    res.render('index', { todos });
});

// Add a new todo
app.post('/add', (req, res) => {
    const todos = getTodos();
    todos.push({ text: req.body.todo, done: false });
    saveTodos(todos);
    res.redirect('/');
});

// Mark todo as done
app.post('/done', (req, res) => {
    const todos = getTodos();
    const index = parseInt(req.body.index);
    if (todos[index]) todos[index].done = true;
    saveTodos(todos);
    res.redirect('/');
});

// Delete todo
app.post('/delete', (req, res) => {
    const todos = getTodos();
    const index = parseInt(req.body.index);
    todos.splice(index, 1);
    saveTodos(todos);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
