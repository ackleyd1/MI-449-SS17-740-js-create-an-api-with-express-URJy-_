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
  var slug = request.body.text.trim().toLowerCase().split(' ').join('-')
  todos[slug] = {
    text: request.body.text.trim(),
    completed: request.body.completed
  }
  response.redirect('/todos')
})

app.get('/todos/:slug', function (request, response) {
  var todo = todos[request.params.slug]
  if (!todo) {
    response.status(404).end('sorry, no such todo: ' + request.params.slug)
    return
  }
  response.json(todo)
})

app.put('/todos/:slug', function (request, response) {
  var todo = todos[request.params.slug]
  if (!todo) {
    response.status(404).end('sorry, no such todo: ' + request.params.slug)
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

app.delete('/todos/:slug', function (request, response) {
  var todo = todos[request.params.slug]
  if (!todo) {
    response.status(404).end('sorry, no such todo: ' + request.params.slug)
    return
  }
  delete todos[request.params.slug]
  response.redirect('/todos')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
