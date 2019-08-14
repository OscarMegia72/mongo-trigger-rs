const mongo = require('./main')
const moment = require('moment')
mongo.setVerbose(false)
mongo.sincro.on('change',(data)=>{
    console.log("=======================")
    console.log(data)
    console.log("=======================")
})
mongo.mongoConnection('mongodb://localhost:27017?w=0&readPreference=primary').then(result=>{
        mongo.createCollection('oscar-rt',"pruebas",{}).then(x=>{
         })
        mongo.createEventRealTime('oscar-rt','pruebas')
        updateDemo()

})
function updateDemo(){
    setInterval(x=>{
        let doc={
            _id:moment().format('HH:mm:ss'),
            fecha: moment().format('YYYY-MM-DD - HH:mm:ss')
        }
        mongo.saveElement('oscar-rt','pruebas',doc)
    },10*1000)   
}     