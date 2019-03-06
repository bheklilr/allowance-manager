import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

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