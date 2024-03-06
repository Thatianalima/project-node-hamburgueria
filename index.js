const express = require('express');
const uuid = require ('uuid');
const port = 3000
const app = express()
app.use(express.json())

const clients = []

const checkClients = (req, res, next) =>{
    const {id} = req.params
    const index = clients.findIndex(client => client.id === id)

    if(index < 0){
        return res.status(404).json({mensagem:'User not found '})
    }
    req.clientIndex = index
    req.clientId = id
    next()
}

const checkMethodUrl = (req, res, next) =>{
    const url = req.url
    const method = req.method
    console.log (`The method used is: ${method}, and the url used is: ${url}`)

    next()

}

app.get('/clients',checkMethodUrl, (req, res) => {
    return res.json(clients)
})

app.post('/clients', checkMethodUrl, (req, res) => {
    const { order, clientName, price, status } = req.body  

    const client = { id: uuid.v4(), order, clientName, price, status}

    clients.push(client)

    return res.status(201).json(client)
})

app.put('/clients/:id', checkMethodUrl, checkClients, (req, res) => {
    const {order, clientName, price, status} = req.body 
    const index = req.clientIndex
    const id = req.clientId

    const updatedStatus = {id, order, clientName, price, status}
   
    clients[index] = updatedStatus

    return res.json(updatedStatus)
})

app.delete('/clients/:id', checkMethodUrl, checkClients, (req, res) => {
    const index = req.clientIndex

    clients.splice(index,1)

    return res.status(204).json()
})

app.get('/clients/:id',checkMethodUrl, (req, res) => {
    const {order, clientName, price, status} = req.body 
    const index = req.clientIndex
    const id = req.clientId

    return res.json(clients[index])
})

app.patch('/clients/:id', checkMethodUrl, checkClients, (req, res) => {
    const {order, clientName, price,} = req.body
    const {status} = req.body
    const index = req.clientIndex
    const id = req.clientId

    const updatedStatus = {id, order, clientName, price, status}
   
    clients[index] = updatedStatus

    return res.json(updatedStatus)
})  

app.listen(port, () =>{
    console.log(`🍔 Server started on ${port}`)
})