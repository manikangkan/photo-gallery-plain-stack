const express = require('express')
const morgan = require('morgan')
/* para trabajar con las imagenes */
const multer = require('multer')
const path = require('path')
/* motor de plantilla */
const exphbs = require('express-handlebars')

// INITIALIZATIONS
const app = express()
require('./database')

// SETINGS
// puerto
app.set('port', process.env.PORT || 3000)
// enlace a los views (carpeta)
app.set('views', path.join(__dirname, 'views'))
// configuramos el engine
app.engine(
	'.hbs',
	exphbs({
		defaultLayout: 'main',
		layoutsDir: path.join(app.get('views'), 'layouts'),
		partialsDir: path.join(app.get('views'), 'partials'),
		extname: '.hbs',
	})
)
// utilizamos el engine
app.set('view engine', '.hbs')

// MIDLEWARS
// --> funciones que se ejecutan antes de llegar a las rutas
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// configuramos multer
const storage = multer.diskStorage({
	destination: path.join(__dirname, 'public/uploads'),
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + path.extname(file.originalname))
	},
})
app.use(multer({ storage }).single('image'))

// ROUTES
app.use(require('./routes'))

module.exports = app
