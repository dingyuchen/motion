import { StateUpdater, useState } from "preact/hooks";
import {
  AttributeDefinition,
  defaultNewAttrDef,
  Schema,
} from "../shared/types";

export const SchemaBuilder = ({
  schema,
  updateHandler,
}: {
  schema: Schema;
  updateHandler: (schema: Schema) => void;
}) => {
  const [workingSchema, setWorkingSchema] = useState(schema);
  const { attributes } = workingSchema;
  const addNewBlankAttribute = () => {
    const newAttributeList = attributes.concat(defaultNewAttrDef());
    setWorkingSchema({ ...workingSchema, attributes: newAttributeList });
  };
  const onChangeCallback = (attribute: AttributeDefinition) => {
    setWorkingSchema;
  };
  return (
    <div>
      Schema builder
      <div>
        <input type="text" label="Name" />
      </div>
      Attributes:
      {attributes.map((attribute) => (
        <AttributeField
          attribute={attribute}
          onChangeCallback={setWorkingSchema}
        />
      ))}
      <button onClick={addNewBlankAttribute}>Add new attribute</button>
    </div>
  );
};

const AttributeField = ({
  attribute,
  onChangeCallback,
}: {
  attribute: AttributeDefinition;
  onChangeCallback: StateUpdater<Schema>;
}) => {
  const { label, type, enumSet, subtype } = attribute;
  return (
    <div>
      Attribute
      <div>Label:</div>
      <input placeholder={label} />
      <div>Type:</div>
      <select></select>
    </div>
  );
};
