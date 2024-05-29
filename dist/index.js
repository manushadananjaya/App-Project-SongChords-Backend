"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const SongRoutes_1 = __importDefault(require("./routes/SongRoutes"));
const ArtistRoutes_1 = __importDefault(require("./routes/ArtistRoutes"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const PlayListRoutes_1 = __importDefault(require("./routes/PlayListRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI;
mongoose_1.default
    .connect(mongoUri, { retryWrites: true, w: "majority" })
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("TypeScript + Node.js + Express Server");
});
// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Initialize routes
app.use("/songs", SongRoutes_1.default);
app.use("/artists", ArtistRoutes_1.default);
app.use("/auth", AuthRoutes_1.default);
app.use("/playlists", PlayListRoutes_1.default);
app.use("/users", UserRoutes_1.default); // Corrected this line
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
