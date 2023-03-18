import express from 'express';
import path from 'path';
import puppeteer from 'puppeteer';
import bodyParser from "body-parser";
import expressSession from "express-session";
import flash from "connect-flash";
import createDir from "./utils/createDir.js";
import webAFinder from "./utils/webAFinder.js";
import downloadSource from './utils/downloadSource.js';
import genRandom from './utils/genRandom.js';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// avoid next error "__dirname is not defined in ES module scope" because it's not a commonJS script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Preload puppeteer
const browser = await puppeteer.launch({ args: ["--disable-web-security"], headless: true });
export const page = await browser.newPage(); 

/**
 * Create essentials dir that cannot been commit
 * process.cwd = dir where nodeJS execute the main script (here server.js) | returns the current working directory of the Node.js process
 * so the litteral path is "dirWhereStockedThisProject/convert-ytb-mp3/public/audio"
 */
createDir(`${process.cwd()}/audio`);

// Session setup for flash messages
const session = expressSession({
    secret: genRandom(7),
    resave: false,
    saveUninitialized: true, // This property is needed to global this.session without any login
    unset: "destroy",
    cookie: { secure: "auto" } // In case of HTTPS server but honestly, i think am gonna remove it soon
})


// Set & use for express app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Message system
app.use((req, res, next) => 
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

// Application with GET/POST
app.get('/', (req, res) =>
{
    res.render('index.ejs');
});

app.post('/', async (req, res) =>
{
    const postURL = req.body.input_link;
    if 
    (
        !postURL ||
        !postURL.match(/https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z]{1,20}/)
    )
    {
        req.flash('error_msg', "The URL is not a valid Youtube link");
        return res.redirect('/');
    }

    const urlFinder = await webAFinder(postURL);
    await downloadSource(urlFinder);

    req.flash('success_msg', '.weba downloaded and renamed in .mp3 file !');
    res.redirect('/');
});

app.listen(PORT, () =>
{
    console.log('Server ON ! http://localhost:' + PORT);
});