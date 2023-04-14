const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors())

const mercadopagoRoute = require("./routes/mercadopago");
app.use(mercadopagoRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});