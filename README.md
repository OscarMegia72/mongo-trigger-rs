Arrancar servidor
sudo mongod --replSet "rs"

Primera Vez
bin/mongo
rs.initiate()

Cadena de Conexion
mongodb://localhost:27017?w=0&readPreference=primary'

const changeStream = db.collection(“data”).watch(pipeline);
changeStream.on(“change”, function(change) {…..