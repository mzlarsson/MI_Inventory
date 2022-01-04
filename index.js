var express = require('express'), http = require('http');
var app = express();
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

var model = require('./model')(io);
model.loadData();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var flash = require('express-flash'), cookieParser = require('cookie-parser'), session = require('express-session');
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true, secret: 'keyboard cat' }));
app.use(flash());

app.set('json spaces', 4);

const path = require('path');
const hbs = require('express-handlebars');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: require('./hbs-helpers')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static('public'));

const controller = require("./controller")(model);
app.use("/", controller);

var port = (process.argv.length>2?parseInt(process.argv[2]):4218);
httpServer.listen(port, function(){
    console.log("Server running at port %s", httpServer.address().port)
});
