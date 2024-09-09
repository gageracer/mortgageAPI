import express from "express";
import mortgageRoutes from "./routes/mortgage";

const app = express();
app.use(express.json());
app.use(express.static("web"));
app.use("/api/mortgage", mortgageRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
