import express from "express";
import fileUpload from 'express-fileupload';
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helper from "./helpers/index.js";
import routes from "./routes/index.js";
const app = express();
const __dirname = path.dirname(fileURLToPath(
    import.meta.url));

app.set("views", path.join(__dirname, "/views"));
var publicDir = path.join(__dirname, '/node_modules');

app.use('/', express.static(publicDir));
// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(compression());
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, strict: false }));
app.use(express.json());

routes(app);
app.use(helper.error.notFound);
app.use(helper.error.internalServerError);
app.use(fileUpload());

app.listen(process.env.PORT, () => {
    console.log(`🚀 server started at ${process.env.PORT}`);
});