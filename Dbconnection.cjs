const {MongoClient}=require('mongodb')


let dbconnection
function connectDb(Callback){
   MongoClient.connect('mongodb+srv://Jeeva_123:Jeeva123@cluster0.x7mr9cy.mongodb.net/ExpenseTacker?retryWrites=true&w=majority').then(function(client){
    dbconnection = client.db()
    Callback()
   }).catch(function(error){
     Callback(error)
   })
}

function getDb(){
  return dbconnection
}
module.exports = {connectDb,getDb}