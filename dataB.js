import {DatabaseSync} from 'node:sqlite'
const db=new DatabaseSync('inventory.db')


db.exec(`
  CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK (price>=0),
   quantity INTEGER NOT NULL CHECK (quantity>=0)
  )
  `)
  export default db
