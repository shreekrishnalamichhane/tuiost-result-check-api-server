import fs from 'fs';

const Utils = {
    // Returns the sha256 hash of the given string
    hashCode: (val: string): string => {
        return require("crypto").createHash("sha256").update(val).digest("hex");
    },

    // Checks if the file exists with given path
    existsFile: (path: string) => {
        try {
            const data = fs.existsSync(path)
            return data
        } catch (err) {
            console.error("Read File Error : ", err)
            return false
        }
    },

    // Write the given content to the file with given path
    writeFile: (path: string, content: string) => {
        try {
            fs.writeFileSync(path, JSON.stringify(content));
            return true
        } catch (err) {
            console.error("Write File Error : ", err)
            return false
        }
    },

    // Append the given content to the file with given path
    appendFile: (path: string, newContent: string) => {
        try {
            fs.appendFileSync(path, newContent + "\n");
            return true
        } catch (err) {
            console.error("Append File Error : ", err);
            return false
        }
    },
}

export default Utils;