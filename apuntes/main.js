const MongoClient = require( "mongodb");
const Emitter = require('events').EventEmitter
const moment = require('moment')
// class MyEmitter extends EventEmitter {}
module.exports = {
  connected:undefined,
  last_md5:undefined,
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
        // localhost: 'mongodb://localhost:27017'
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
  // createWatchEvent: function(db, refresh){
  //   setInterval(x=>{
  //     let data=this.connected.db(db).command ( { dbHash: 1} ).then(db_hash=>{
  //       let tempArray=[]
  //       Object.keys(db_hash.collections).forEach(name=>{
  //         let value=db_hash.collections[name]
  //         if(this.isVerbose)console.log(moment().format('HH::mm:ss'),name,value)
  //         tempArray.push({key: name,value: value})
  //       })
  //       tempArray.forEach(db_hash=>{
  //         // sino existe clave primera vez se guarda en las dos tablas
  //         if(!this.map_collections.has(db_hash.key)){
  //           this.map_collections.set(db_hash.key,db_hash.value)
  //         }else{
  //           if(this.map_collections.get(db_hash.key)!=db_hash.value){
              
  //             this.map_collections.set(db_hash.key,db_hash.value)
  //             this.event.emit('changed',{collection:db_hash.key,hash:db_hash.value})
  //             if(this.isVerbose)console.log("Collecction Changed: ",db_hash.key,"emit:changed")
  //           }
  //         }
  //       })
  //     })
  //   },refresh)
  // },
  createCollection: function(db,col_name, options){
      return new Promise((resolve,reject)=>{
        try{
          this.connected.db(db).createCollection(col_name,options,function(err,res){
              if (err) throw err;
              if(this.isVerbose)console.log("Collection created!");
              this.pos++
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