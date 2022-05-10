const express = require ("express")
const uuid = require ("uuid")
const app = express()

app.use(express.json())



const Clients = []

const MyFirstMiddleware = (request, response, next) =>{
    const { id } = request.params

    const index = Clients.findIndex(Client=> Client.id === id)
if(index < 0){
    return response.status(404).json({message:"User Not Found"})
}

request.userIndex = index

next()
}

const MySecondMiddleware = (request, response, next) => {
        const method = request.method
        const url = request.path
        console.log("Method:", "[", method, "]", "-", "URL:", url)
    next()
}

app.post("/order", MySecondMiddleware, MySecondMiddleware,(request,response) =>{  
    const { order, clientName, price, status} = request.body
    
    const user = {id:uuid.v4(),order, clientName, price, status}

    Clients.push(user)

    return response.status(201).json(Clients)

})


app.get("/order", MySecondMiddleware,(request, response) =>{
   return response.json(Clients)
})


app.put("/order/:id", MyFirstMiddleware, MySecondMiddleware,(request,response)=>{
const { id } = request.params
const {order, clientName, price, status} = request.body

const index = request.userIndex

const ChangeOrder = {id,order, clientName, price, status}


Clients[index] = ChangeOrder

    return response.json(ChangeOrder)
})

app.delete("/order/:id", MyFirstMiddleware, MySecondMiddleware,(request, response)=>{
    const index = request.userIndex

Clients.splice(index,1)

return response.status(200).json()
})

app.listen(3000)