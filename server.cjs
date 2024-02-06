const express = require('express')
const bodyparser = require('body-parser')
const {connectDb,getDb} = require('./Dbconnection.cjs')
const {ObjectId} = require('mongodb')

const app = express()
app.use(bodyparser.json())

let db
connectDb((function(error){
    if(error){
        console.log('cannot establish the port....')
        console.log(error)
    }else{
        const port = process.env.PORT || 8000
        app.listen(port)
        db = getDb()
        console.log(`listening the port ${port}`)
    }
}))

app.post('/add-entry',function(request,response){
    db.collection('ExpenseData').insertOne(request.body).then(() => {
        response.status(201).json({
            "status": "Entry added sucessfully"
        })
    }).catch(function (){
            response.status(500).json({
              "status":"Entry not added"
        })
    })
})
app.get('/fetch-entry',function(request,response){
    const entries = []
    db.collection('ExpenseData')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function(){
        response.status(200).json(entries)
    }).catch(function(){
        response.status(404).json({
            'status':'could not fetch the documents...'
        })
    })

})
app.delete('/delete-entry',function(request,response){
    if(ObjectId.isValid(request.query.id)){
        db.collection('ExpenseData').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function(){
            response.status(200).json({
                'status':'Entry data sucessfully deleted'
            })
        }).catch(function(){
            response.status(500).json({
                'status':'Entry data is not deleted'
            })
        })
    }else(function(){
        response.status(500).json({
            'status':'Entry is invalid'
        })
    })
})
app.patch('/update-entry/:id',function(request,response){
    if(ObjectId.isValid(request.params.id)){
        db.collection('ExpenseData').updateOne(
            {  _id: new ObjectId(request.params.id)},
            { $set: request.body}).then(function(){
                response.status(200).json({
                    'status':'Entry is updated sucessfully'
                })
            }).catch(function(){
                response.status(500).json({
                    'status':'Entry is not updated sucessfully'
                })
            })
    }else(function(){
        response.status(500).json({
            'status':'Entry is invalid'
        })
    })
})