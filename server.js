const express = require("express");
const path = require("path");
const routes = require("./routes/routes");
const cookieSession = require("cookie-session");
const createError = require("http-errors");
const bodyParser = require("body-parser");

const FeedbackService = require("./services/FeedbackService");
const feedbackService = new FeedbackService("./data/feedback.json");

const SpeakerService = require("./services/SpeakerService");
const speakersService = new SpeakerService("./data/speakers.json");

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "./static")));

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["GHjnjdbsavcdnkddv", "hhnvjdnfjsiuvbjid"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.locals.siteName = "ROUX Meetups";
app.use(async (req, res, next) => {
  try {
    const names = await speakersService.getNames();
    res.locals.speakerNames = names;
    console.log(res.locals);
    return next();
  } catch (err) {
    return next(err);
  }
});
app.use(
  "/",
  routes({
    feedbackService,
    speakersService,
  })
);

app.use((req, res, next) => {
  return next(createError(404, "File not found"));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
