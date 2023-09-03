const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors())

const preferenceRoute = require("./routes/preference");
app.use(preferenceRoute);

const notificateRoute = require("./routes/notificate");
app.use(notificateRoute);

const trackingCodeRoute = require("./routes/sendTrackingCode");
app.use(trackingCodeRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});