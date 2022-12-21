import { getMetadataStorage, registerDecorator } from 'class-validator';

export const InheritParentDecorators = () => {
  return (target: any, propertyKey: string) => {
    const storage = getMetadataStorage();
    const parent = Object.getPrototypeOf(target.constructor);

    if (!parent) {
      return;
    }

    const targetMetadatas = storage.getTargetValidationMetadatas(
      parent,
      parent.name,
      false,
      false,
    );

    targetMetadatas
      .filter(({ propertyName }) => propertyName === propertyKey)
      .forEach(
        ({
          type,
          propertyName,
          validationTypeOptions,
          message,
          constraints,
          constraintCls,
        }) => {
          registerDecorator({
            name: type,
            target: target.constructor,
            propertyName,
            options: { ...validationTypeOptions, message },
            constraints,
            validator: constraintCls,
          });
        },
      );
  };
};
