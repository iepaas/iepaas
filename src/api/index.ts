import * as express from "express"
import { api } from "./routes"
import { errorHandler } from "./middleware/errorHandler"

const app = express()

app.use("/api/v1", api)

app.get("/errors/appNotBuilt", (req, res) =>
	res.status(200).send("App not built!")
)

app.get("/errors/appNotRunning", (req, res) =>
	res.status(200).send("App not running!")
)

app.use((req, res) => res.status(404).send())
app.use(errorHandler)

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}!`)
})
