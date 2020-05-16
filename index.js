const _ = require("./createModule");
const schema = require("./schema.json");

//TODO: Add Relations
schema.forEach( element => {
    const {name, variable} = element;
    _.createModule(name,variable);
});
