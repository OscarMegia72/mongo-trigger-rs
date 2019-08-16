const MongoClient = require( "mongodb");
const Emitter = require('events').EventEmitter
const moment = require('moment')
module.exports = {
  connected:undefined,
  isVerbose:false,
  map_collections: new Map(),
  sincro: new Emitter(),
  setVerbose: function(estado){
    this.isVerbose=estado
  },
  mongoConnection: function(uri_mongo){
    return new Promise((resolve,reject)=>{
      if(this.connected){
        resolve(this.connected) 
      }else{
        MongoClient.connect(uri_mongo,{ useNewUrlParser: true },
          ).catch(err => {
              console.error(err)
              process.exit(1)
            })
          .then(async client => {
              this.connected=client
             if(this.isVerbose) console.log(this.isVerbose,"MongoDb-Cliente $ connected",this.connected.s.url)
             resolve(client) 
            })
        }
    })
   
  },
  createEventRealTime: function(db,collection){
    const changeStream = this.connected.db(db).collection(collection).watch();
    changeStream.on('change', (change) => {
      this.sincro.emit('change',change)
      if(this.isVerbose)console.log("Collecction Changed: ",change.ns,"emit:changed")
    });
  },
  createCollection: function(db,col_name, options){
      return new Promise((resolve,reject)=>{
        try{
          this.connected.db(db).createCollection(col_name,options,function(err,res){
              if (err) throw err;
              if(this.isVerbose)console.log("Collection created!");
              return resolve('ok')
          })
  
        }catch (e) {
          console.error(`Unable to createCollection: ${e}`)
          return { error: e }
        }
      }) 
    },
  saveElement: function(db,col_name,doc){
      let self=this
      return new Promise((resolve,reject)=>{
        try{
          this.connected.db(db).collection(col_name).insertOne(doc,function(err,res){
              if (err) throw err;
              console.log(self.isVerbose,db,col_name,doc)
              resolve('ok')
          })
        }catch (e) {
          console.error(`Unable to insert: ${e}`)
          return { error: e }
        }
      }) 

    }
}