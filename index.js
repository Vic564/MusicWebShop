const mongoose = require('mongoose')
require('dotenv').config()
const {app} = require('./src/server')
const {MONGODB, PORT} = require('./config/config')

mongoose.connect(MONGODB.connection, MONGODB.options).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
})
