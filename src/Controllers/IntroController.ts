import { Request, Response } from "express";
import moment from "moment";
import ResponseService from "../Services/ResponseService";

const IntroController = {
    // Get intro
    intro: async (req: Request, res: Response) => {
        try {
            const response =
            {
                "title": process.env.APP_TITLE || "TUIOST Exam Result API",
                "description": process.env.APP_DESCRIPTION || "",
                "author": {
                    "name": "Shree Krishna Lamichhane",
                    "url": "https://site.shreekrishnalamichhane.com.np",
                    "github": "https://github.shreekrishnalamichhane.com.np"
                },
                "routes": {
                    "results": [
                        {
                            "method": "GET",
                            "url": process.env.APP_URL + "/results/options",
                            "description": "Get the list of available exam options",
                        },
                        {
                            "method": "POST",
                            "url": process.env.APP_URL + "/results/check",
                            "description": "Check the results of the exam",
                            "body": {
                                "examId": "The ID of the exam available from /options endpoint | string",
                                "symbol": "The symbol number of the student | string"
                            }
                        },
                    ],
                },
                "responseTime": moment().diff(res.locals.start, 'milliseconds') + "ms"
            }

            // Return the cache
            return ResponseService.response(res, true, 200, "Success", response);

        }
        catch (error: any) {
            return ResponseService.response(res, false, 400, error.message, null);
        }
    }
};

export default IntroController;