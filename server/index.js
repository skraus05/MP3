require('dotenv').config()
const { sequelize : db } = require('../models')
const port = process.env.PORT || 4000
const app = require('./app')
//const seed = require('../script/seed');
const { connect } = require('./api');
const express = require('express')
const app = express()
;


const init = async () => {
  try {
    await db.authenticate()
    console.log('db connected')
    
  } catch(e){
    console.log('db connection failed')
  }

  try {
    if(process.env.SEED === 'true'){
      await seed();
    }
    else {
      await db.sync()
    }

    // start listening (and create a 'server' object representing our server)
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
  } catch (ex) {
    console.log(ex)
  }
}

init()

