import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UniqueCodeConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];
    return getManager()
      .count(entity, { [args.property]: value?.toUpperCase() })
      .then((count) => count < 1);
  }
}

export function UniqueCode(
  entity: Function,
  validationOptions?: ValidationOptions,
) {
  validationOptions = {
    ...{
      message: `The field CODE: $value, already exists in table ${
        entity.toString().split(' ')[1]
      }. Choose another.`,
    },
    ...validationOptions,
  };
  return function (object: Object, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueCodeConstraint,
    });
  };
}
