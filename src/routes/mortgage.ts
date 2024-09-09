import { Router, type Request, type Response } from "express";
import { mortgageWebHandler } from "./mortgage/web";
import { mortgageJSONHandler } from "./mortgage/json";

const router = Router();

router.post("/", (req: Request, res: Response) => {
	const acceptHeader = req.get("Content-Type");

	if (acceptHeader?.includes("application/x-www-form-urlencoded")) {
		mortgageWebHandler(req, res);
	} else if (acceptHeader?.includes("application/json")) {
		mortgageJSONHandler(req, res);
	}
});

export default router;
