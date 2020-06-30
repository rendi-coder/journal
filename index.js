const express = require('express')
const exphbs  = require('express-handlebars');
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const authRoutes = require('./routes/auth')
const journalRoutes = require('./routes/journal')
const timeTableRoutes = require('./routes/timeTable')
const groupRoutes = require('./routes/addGroup')
const multer  = require("multer");
const  varMiddleware = require('./middleware/variables')

const MONGODB_URI = `mongodb+srv://rendi:221197@cluster0-rmhdk.mongodb.net/journal`
const app = express()

//app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("filedata"));

//Настройка handleBars
const hbs=exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

const store = new MongoStore({
  collection: 'sessions',
  uri:MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')//папка с файлами для рендеринга 2 arg
//end настройки handleBars

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'some secret value',
  resave:false,
  saveUninitialized:false,
  store
}))
app.use(varMiddleware)

app.use('/',homeRoutes)
app.use('/auth',authRoutes)
app.use('/timetable',timeTableRoutes)
app.use('/journal',journalRoutes)
app.use('/group',groupRoutes)


const PORT= process.env.PORT || 3000


async function start() {
    try { 
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify:false,//new 
      })
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
    } catch (e) {
      console.log(e)
    }
  }
  
  start()

