const path = require('path');
const env = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const methodOverride = require('method-override');

const sql = require('./database/mysql');

env.config();
const app = express();

app.use(cors());
app.use(methodOverride('_method'));

sql.connect();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware for parsing bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
// const staffRoutes = require('./routes/staff');
// const studentRoutes = require('./routes/student');
const homeRoutes = require('./routes/home');

app.use('/admin', adminRoutes);
// app.use('/staff', staffRoutes);
// app.use('/student', studentRoutes);
app.use('/', homeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started @ ${PORT}`);
});
