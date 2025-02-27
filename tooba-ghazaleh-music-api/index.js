import express from "express";
import cors from "cors";
import "dotenv/config";
import songs from "./routes/songs.js";

const app = express();
const port = process.env.PORT || process.argv[2] || 8080;

app.use(express.json());

const { CORS_ORIGIN } = process.env.CORS_ORIGIN;
app.use(cors({ origin: CORS_ORIGIN }));
app.use(cors());

app.get("/genre/:id", songs);

app.listen(port, () => console.log(`Listening on ${port}`));