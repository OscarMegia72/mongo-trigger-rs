# Conexion a eventos de MongoDb en tiempo real

El servidor deberá ser una replica set o arrancado como tal. Esto se puede hacer en una instalación local.
El paquetes es muy sencillo. El mensaje de mongodb se propaga via EventEmitter y es muy completo aportando el tipo de operación, el documento modificado, la base de datos , la colección y los documentKey

```
{
  _id: {
    _data: '825D565769000000012B022C0100296E5A100462993E363D1842A09889796AA4486997463C5F6964003C30393A31323A3431000004'
  },
  operationType: 'insert',
  clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1565939561 },
  fullDocument: { _id: '09:12:41', fecha: '2019-08-16 - 09:12:41' },
  ns: { db: 'oscar-rt', coll: 'pruebas' },
  documentKey: { _id: '09:12:41' }
}
```



#### Arrancar servidor en modo Replica Set

```
sudo mongod --replSet "rs"
// Primera Vez
bin/mongo
rs.initiate()
```

##### Cadena de Conexion

```
mongodb://localhost:27017?w=0&readPreference=primary'
```

##### Ejemplo / test

```
npm run replica
```

