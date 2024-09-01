import express from "express";
import controllerAccount from "./controllers/account.js";
import controllerRestaurants from "./controllers/restaurants.js";
import { __srcdirname } from "./fs.js";
import path from "path";
import controllerPlaces from "./controllers/places.js";

const app = express();
const port = 3000;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__srcdirname, "public"))); // 정적 public 폴더

controllerAccount(app);
controllerRestaurants(app);
controllerPlaces(app);

app.listen(port, () => {
  console.log("Server Address => http://localhost:" + port);
});
