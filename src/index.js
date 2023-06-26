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
app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)
app.use("/pilots", pilotRouter)
app.use("/drones", droneRouter)
app.use("/flights", flightRouter)
app.use("/pfr", postFlightReportRouter)
app.use("/histories", historyRouter)
app.use("/checklists", checklistRouter)
app.use("/contacts", contactRouter)
app.use("/kml", kmlRouter)

app.use('/assets', express.static('assets'))

dotenv.config()
const DB_PASS = process.env.DB_PASS
const MY_DB = process.env.MY_DB

mongoose.connect(
    `mongodb+srv://uavits:${DB_PASS}@uavitsskripsi.4ooztii.mongodb.net/${MY_DB}?retryWrites=true&w=majority`
)

app.listen(8080, () => console.log("SERVER_STARTED"))