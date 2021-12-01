#!/usr/bin/env node
const args = process.argv.slice(2)
const nameRegex = /day\d{1,2}$/

if (args[0] && args[0].match(nameRegex)) {
    // run the solution for day**
    const solution = require(`./solutions/${args[0]}`)
    if (args[1] === "test") {
        // using test input
        console.log(`Testing ${args[0]}...`)
        console.log(solution.solve(`test_input/${args[0]}.txt`))
    } else {
        // using full input
        console.log(`Running ${args[0]}...`)
        console.log(solution.solve(`input/${args[0]}.txt`))
    }
} else if (args[0] && args[0] === "new") {
    if (args[1].match(nameRegex)){
        // create files (solution & input) for day**
        // if they don't exist
        const fs = require("fs");
        const { exec } = require("child_process");
        fs.access(`solutions/${args[1]}.js`, (err) => {
            if (err) exec(`cp template.js solutions/${args[1]}.js`)
        })
        exec(`touch input/${args[1]}.txt`)
        exec(`touch test_input/${args[1]}.txt`)
    } else {
        console.log(`Invalid name: ${args[1]}`)
    }
}
else {
    console.log(`Unknown command: ${args[0]}`)
}