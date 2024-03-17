import { Response } from "express";
import moment from "moment";

const ResponseService = {
    response: (response: Response, success: boolean = true, statusCode: number = 200, message: string = "", data: any = []) => {
        return response.status(statusCode).json({
            success: success,
            statusCode: statusCode,
            message: message,
            serverTime: moment().locale("np").format("YYYY-MM-DD hh:mm:ss A"),
            data: data ?? null
        });
    }
};

export default ResponseService;