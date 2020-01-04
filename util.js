var fs = require("fs");
var _ = require("lodash");
const u = require("util");

const writeFile = u.promisify(fs.writeFile);

const readFile = u.promisify(fs.readFile);
const mkdir = u.promisify(fs.mkdir);
const exists = u.promisify(fs.exists);

const createParameters = (variable, update = false, dto = false) => {
    let temp = "";
    variable.forEach(element => {
        temp += "\n";
        temp += `@ApiModelProperty()\n`;
        if (!dto) {
            element.decorators.forEach(v => {
                temp += `${v}\n`;
            });
        }
        if (element.isOptional && update) {
            temp += `@IsOptional()\n`;
        }
        temp += `readonly ${element.name}: ${element.type};\n`;
    });
    return temp;
};

const createDecorators = variable => {
    return _.uniq(_.flatMap(variable.map(v => v.decorators)))
        .toString()
        .split("@")
        .join("")
        .split("()")
        .join("");
};

const dtoAssign = (variable, name) => {
    let temp = "";
    variable.forEach(element => {
        temp += `this.${element.name} = ${name}.${element.name};\n`;
    });
    return temp;
};

const createService = (variable, name, update = false) => {
    let temp = "";
    const prefix = update ? "UpdateDto" : "CreateDto";
    variable.forEach(element => {
        temp += `${name}.${element.name} = ${prefix}.${element.name}`;
        if (update) {
            temp += ` || ${name}.${element.name}`;
        }
        temp += `;\n`;
    });
    return temp;
};

const entityParameters = variable => {
    let temp = "";
    variable.forEach(element => {
        element.parameters.forEach(v => {
            temp += `${v}\n`;
        });
        temp += `${element.column}\n`;
        temp += `${element.name}: ${element.type};\n`;
    });
    return temp;
};

const validateString = (value, type) => {
    if (!value || value.length < 3) {
        throw Error(`${type} is not correct`);
    }
};

const validateElement = (value, type) => {
    value.forEach(e => {
        validateString(e, type);
    });
};

const validate = variable => {
    try {
        if (
            variable.map(v => v.name).length !==
            _.uniq(variable.map(v => v.name)).length
        ) {
            throw Error("variable name is not unique");
        }
        variable.forEach(v => {
            validateString(v.name);
            validateString(v.type);
            validateString(v.column);
            if (v.isOptional === undefined || v.isOptional === null) {
                throw Error("isOptional is not correct");
            }
            if (v.decorators.length === 0) {
                throw Error("decorators is not correct");
            }
            validateElement(v.decorators, "decorators");
            validateElement(v.parameters, "parameters");
        });

        console.log(`Validation is correct.\n`);
    } catch (error) {
        throw error;
    }
};

const replaceAll = (text, search, replaceValue) => {
    return text
        .toString()
        .split(search)
        .join(replaceValue);
};

const replaceAllName = (text, name) => {
    const uppercase = name.charAt(0).toUpperCase() + name.substr(1);
    text = replaceAll(text, "<%= UpperCaseName %>", uppercase);
    text = replaceAll(text, "<%= Name %>", name);
    return text;
};

const createDir = async path => {
    const status = await exists(path);
    if (!status) await mkdir(path, 0o777);
    console.log(`Folder ${path} created successfull.`);
};

const createFile = async (template, filename, name, type, replaces = []) => {
    await readFile(template, "UTF-8").then(async text => {
        text = replaceAllName(text, name);
        replaces.forEach(r => {
            if (r.key && r.value) {
                text = replaceAll(text, r.key, r.value);
            }
        });

        await writeFile(filename, text);
        console.log(`${type} is created successfull. ${filename}`);
    });
};

const existsFiles = async (files = []) => {
    let e = false;
    files.forEach(async file => {
        const status = await exists(file);
        e = e && status;
    });
    return e;
};

module.exports = {
    createParameters,
    createDecorators,
    dtoAssign,
    createService,
    entityParameters,
    validate,
    replaceAll,
    replaceAllName,
    createDir,
    createFile,
    existsFiles
};
