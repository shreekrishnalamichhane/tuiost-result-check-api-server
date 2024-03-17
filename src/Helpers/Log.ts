import moment from "moment-timezone";
import Utils from "./Utils";

const Log = {
    // Log the given message to the console and to the log file 
    weblog: async (message: string | unknown, ip: string) => {
        // Path to the log file
        const path = './log/weblog/' + moment().tz("Asia/Kathmandu").format('YYYY-MM-DD') + '.log';

        // Format the message
        const formattedMessage: string = "[" + moment().tz("Asia/Kathmandu").format("YYYY-MM-DD hh:mm:ss A") + "][" + ip + "] : " + message;

        // Append the message to the log file
        Utils.appendFile(path, formattedMessage)

        // Log the message to the console
        console.log(formattedMessage);
    },

    // Log the given message to the console and to the syslog file 
    syslog: async (message: string | unknown) => {
        // Path to the log file
        const path = './log/syslog/' + moment().tz("Asia/Kathmandu").format('YYYY-MM-DD') + '.log';

        // Format the message
        const formattedMessage: string = "[" + moment().tz("Asia/Kathmandu").format("YYYY-MM-DD hh:mm:ss A") + "][Server] : " + message;

        // Append the message to the log file
        Utils.appendFile(path, formattedMessage)

        // Log the message to the console
        console.log(formattedMessage);
    },
}

export default Log;