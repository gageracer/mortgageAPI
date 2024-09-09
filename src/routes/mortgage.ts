import { Router, type Request, type Response } from "express";
import { mortgageWebHandler } from "./mortgage/web";
import { mortgageJSONHandler } from "./mortgage/json";

const router = Router();

router.post("/", (req: Request, res: Response) => {
	if (req.is("application/x-www-form-urlencoded")) {
		mortgageWebHandler(req, res);
	} else if (req.is("application/json")) {
		mortgageJSONHandler(req, res);
	}
});

export default router;
