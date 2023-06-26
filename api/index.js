import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

import { userRouter } from "./routes/users.js" 
import { pilotRouter } from "./routes/pilots.js"
import { droneRouter } from "./routes/drones.js"
import { flightRouter } from "./routes/flights.js"
import { postFlightReportRouter } from "./routes/postFlightReports.js"
import { historyRouter } from "./routes/histories.js"
import { checklistRouter } from "./routes/checklists.js"
import { contactRouter } from "./routes/contacts.js"
import { kmlRouter } from "./routes/kml.js"

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/api/auth", userRouter)
app.use("/api/pilots", pilotRouter)
app.use("/api/drones", droneRouter)
app.use("/api/flights", flightRouter)
app.use("/api/pfr", postFlightReportRouter)
app.use("/api/histories", historyRouter)
app.use("/api/checklists", checklistRouter)
app.use("/api/contacts", contactRouter)
app.use("/api/kml", kmlRouter)

app.use('/api/assets', express.static('assets'))

app.get("/api", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    return res.status(200).json({
      message: "Welcome to UAVITS APP API!",
    });
  });

dotenv.config()
const DB_PASS = process.env.DB_PASS
const MY_DB = process.env.MY_DB

mongoose.connect(
    `mongodb+srv://uavits:${DB_PASS}@uavitsskripsi.4ooztii.mongodb.net/${MY_DB}?retryWrites=true&w=majority`
)

app.listen(8080, () => console.log("SERVER_STARTED"))