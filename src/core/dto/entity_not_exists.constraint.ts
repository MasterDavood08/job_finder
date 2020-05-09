import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { getRepository } from "typeorm";

@ValidatorConstraint({ name: 'entityNotExists', async: false })
export class EntityNotExists implements ValidatorConstraintInterface {

    async validate(text: number, validationArguments: ValidationArguments) {
        const entity = await getRepository(validationArguments.constraints[1]).findOne({ where: { [validationArguments.constraints[0]]: text } });

        return entity ? true : false
    }

    defaultMessage(args: ValidationArguments) {
        // console.log(args);
        return 'Entity Not exists';
    }

}
