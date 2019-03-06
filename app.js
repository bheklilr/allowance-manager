import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';

import passport from 'passport';
import passportLocal from 'passport-local';

import apiRoutes from './routes/api';
import { initializeDB } from './db';

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'client/build')));

passport.use(new passportLocal.Strategy(
    (username, password, done) => {
        // TODO: lookup auth like this
        /*
        try {
            const match = await findUser(username, password);
            if (match.isValidUser) {
                return done(null, match);
            }
        } catch (err) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        */
       return done(null, {username});
    }
));

if (!process.env.KEYBOARD_CAT) {
    console.error("No keyboard cat");
    process.exit(-3);
}
app.use(session({ secret: process.env.KEYBOARD_CAT }));
app.use(passport.initialize());
app.use(passport.session());

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

initializeDB();

app.use('/api', apiRoutes);

export default app;