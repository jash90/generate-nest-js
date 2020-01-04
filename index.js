const util = require("./util");

const name = "test";

const variable = [
    {
        name: "name",
        type: "string",
        decorators: ["@IsString()"],
        column: "@Column(DataType.TEXT)",
        parameters: ["@Unique(true)"],
        isOptional: false
    }
];

//Create Parameters

const CreateParameters = util.createParameters(variable);

const CreateParametersDecorators = util.createDecorators(variable);

const UpdateParametersDecorators = `${CreateParametersDecorators},IsOptional`;

const UpdateParameters = util.createParameters(variable, true);

const DtoParameters = util.createParameters(variable, false, true);

const DtoAssign = util.dtoAssign(variable, name);

// validate

util.validate(variable);

// create structure

createStructure = async () => {
    await util.createDir(`generated`);
    await util.createDir(`generated/${name}`);
    await util.createDir(`generated/${name}/dto`);
    console.log("\nStructure files created successfull.\n");
};

createStructure().then(async () => {
    try {
        // create create-name.dto.ts file

        await util.createFile(
            "template/dto/create.txt",
            `generated/${name}/dto/create-${name}.dto.ts`,
            name,
            "Create DTO",
            [
                {
                    key: "<%= CreateParameters %>",
                    value: CreateParameters
                },
                {
                    key: "<%= CreateParametersDecorators %>",
                    value: CreateParametersDecorators
                }
            ]
        );

        // create update-name.dto.ts file

        await util.createFile(
            "template/dto/update.txt",
            `generated/${name}/dto/update-${name}.dto.ts`,
            name,
            "Update DTO",
            [
                {
                    key: "<%= UpdateParameters %>",
                    value: UpdateParameters
                },
                {
                    key: "<%= UpdateParametersDecorators %>",
                    value: UpdateParametersDecorators
                }
            ]
        );

        // create name.offset.ts file

        await util.createFile(
            "template/dto/offset.txt",
            `generated/${name}/dto/${name}.offset.ts`,
            name,
            "Offset"
        );

        // create name.dto.ts file

        await util.createFile(
            "template/dto/dto.txt",
            `generated/${name}/dto/${name}.dto.ts`,
            name,
            "Model DTO",
            [
                {
                    key: "<%= DtoParameters %>",
                    value: DtoParameters
                },
                {
                    key: "<%= DtoAssign %>",
                    value: DtoAssign
                }
            ]
        );

        console.log("\nModels created succesfull.\n");

        // create names.providers.ts file

        await util.createFile(
            "template/providers.txt",
            `generated/${name}/${name}s.providers.ts`,
            name,
            "Providers"
        );

        // create names.module.ts file

        await util.createFile(
            "template/module.txt",
            `generated/${name}/${name}s.module.ts`,
            name,
            "Module"
        );

        // create names.controller.ts file

        await util.createFile(
            "template/controller.txt",
            `generated/${name}/${name}s.controller.ts`,
            name,
            "Controller"
        );

        // create names.controller.ts file

        await util.createFile(
            "template/controller.txt",
            `generated/${name}/${name}s.controller.ts`,
            name,
            "Service",
            [
                {
                    key: "<%= CreateService %>",
                    value: util.createService(variable, name)
                },
                {
                    key: "<%= UpdateService %>",
                    value: util.createService(variable, name, true)
                }
            ]
        );

        // create names.controller.ts file

        await util.createFile(
            "template/entity.txt",
            `generated/${name}/${name}.entity.ts`,
            name,
            "Entity",
            [
                {
                    key: "<%= EnityParameters %>",
                    value: util.entityParameters(variable)
                }
            ]
        );

        console.log("\nService created succesfull.\n");
    } catch (error) {
        throw error;
    }
});
