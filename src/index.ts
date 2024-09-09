import express from "express";
import mortgageRoutes from "./routes/mortgage";
import path from "node:path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "web" directory
app.use(express.static(path.join(__dirname, "web")));

app.use("/api/mortgage", mortgageRoutes);
// Serve the index.html file for the root route
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../web", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Click here to check the portal: http://localhost:${PORT}`);
});
