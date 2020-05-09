import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { getRepository } from "typeorm";

@ValidatorConstraint({ name: 'entityExists', async: false })
export class EntityExists implements ValidatorConstraintInterface {

    async validate(text: number, validationArguments: ValidationArguments) {
        const entity = await getRepository(validationArguments.constraints[1]).findOne({ where: { [validationArguments.constraints[0]]: text } });

        return entity ? false : true
    }

    defaultMessage(args: ValidationArguments) {
        // console.log(args);
        return 'Entity exists';
    }

}
