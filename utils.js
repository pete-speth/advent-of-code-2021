const fs = require("fs")

module.exports = {
    parseInputToList: (filepath, parseFunction) => {
        return fs.readFileSync(filepath, "utf8")
            .split("\n")
            .map(line => parseFunction(line))
    }
}