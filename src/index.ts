import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';

import dotenv from "dotenv";
dotenv.config();

import IntroRouter from "./Routes/Intro";
import ResultRouter from "./Routes/Result";
import BrowserService from "./Services/BrowserService";
import Log from "./Helpers/Log";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));

const logger = (req: Request, res: Response, next: NextFunction) => {
    Log.weblog(`${req.method} ${req.url}`, req.ip);
    next();
}

(async () => {
    let browser = await BrowserService.init();
    app.use('/', [logger], IntroRouter);
    app.use('/result', [(req: Request, res: Response, next: NextFunction) => { res.locals.browser = browser; next() }, logger], ResultRouter);
})();

export default app;

app.listen(PORT, () => {
    Log.syslog("Server : started on port " + PORT);
});