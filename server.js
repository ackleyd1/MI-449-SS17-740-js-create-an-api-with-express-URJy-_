var express = require('express')
var todos = require('./todos.js')

var app = express()
var port = process.env.PORT || 8080

var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my API!'
  })
})

app.get('/todos', function (request, response) {
  response.json(todos)
})

app.post('/todos', function (request, response) {
  var id = Object.keys(todos).length
  todos[id] = {
    text: request.body.text.trim(),
    completed: request.body.completed
  }
})

app.get('/todos/:id', function (request, response) {
  var todo = todos[request.params.id]
  if (!todo) {
    response.status(404).end('sorry, no such todo')
    return
  }
  response.json(todo)
})

app.put('/todos/:id', function (request, response) {
  var todo = todos[request.params.id]
  if (!todo) {
    response.status(404).end('sorry, no such todo')
    return
  }
  if (request.body.text !== undefined) {
    todo.text = request.body.text.trim()
  }
  if (request.body.completed !== undefined) {
    if (typeof (request.body.completed) === 'boolean') {
      todo.completed = request.body.completed
    }
  }
  response.redirect('/todos')
})

app.delete('/todos/:id', function (request, response) {
  var todo = todos[request.params.id]
  if (!todo) {
    response.status(404).end('sorry, no such todo')
    return
  }
  delete todos[request.params.id]
  response.redirect('/todos')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
