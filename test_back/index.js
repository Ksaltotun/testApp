const express = require("express");
const fs = require("fs");
const cors = require("cors");

const deformation_response = fs.readFileSync(
  "deformation_response.json",
  "utf8"
);
const termo_response = fs.readFileSync("termo_response.json", "utf8");

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/api/measurements/", (req, res) => {
  const id = req.query.id;

  setTimeout(() => {
    if (id === 'deformation') {
        res.send(deformation_response);
    } else if (id === 'thermistor'){
        res.send(termo_response);
    } else {
        res.status(403).send('O! Smth goes wrong...')
    }
    
  }, 1600);
});

app.listen(port, () => {
  console.log(`Wake up, Neo... ${port}`);
});
