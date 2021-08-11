import { ReadSyncOptions } from "fs";
import { StateUpdater, useState } from "preact/hooks";
import { AttributeType } from "../../motion-bee/lib/types";
import {
  AttributeDefinition,
  defaultNewAttrDef,
  Schema,
} from "../shared/types";
import { immutableReplace } from "../shared/util";

export const SchemaBuilder = ({
  schema,
  updateHandler,
  schemaSpace,
}: {
  schema: Schema;
  schemaSpace: (AttributeType | string)[];
  updateHandler: (schema: Schema) => void;
}) => {
  const [workingSchema, setWorkingSchema] = useState(schema);
  const { attributes } = workingSchema;
  const addNewBlankAttribute = () => {
    const newAttributeList = attributes.concat(defaultNewAttrDef());
    setWorkingSchema((prev) => ({ ...prev, attributes: newAttributeList }));
  };
  const onChangeCallback =
    (index: number) => (attribute: AttributeDefinition) => {
      setWorkingSchema((prev) => {
        const { attributes } = prev;
        return {
          ...prev,
          attributes: immutableReplace(attributes, index, attribute),
        };
      });
    };
  const nameChangeHandler = (e: Event) => {
    if (
      e instanceof InputEvent &&
      e.currentTarget instanceof HTMLInputElement
    ) {
      const name = e.currentTarget.value;
      setWorkingSchema((prev) => ({ ...prev, name }));
    }
  };
  return (
    <div>
      <div>
        Schema builder
        <div>
          <input type="text" label="Name" onInput={nameChangeHandler} />
        </div>
        Attributes:
        {attributes.map((attribute, index) => (
          <AttributeField
            attribute={attribute}
            availableTypes={schemaSpace}
            onChangeCallback={onChangeCallback(index)}
          />
        ))}
        <button onClick={addNewBlankAttribute}>Add new attribute</button>
      </div>
      <button onClick={() => updateHandler(workingSchema)}>Done</button>
    </div>
  );
};

const AttributeField = ({
  attribute,
  onChangeCallback,
  availableTypes,
}: {
  attribute: AttributeDefinition;
  onChangeCallback: (attribute: AttributeDefinition) => void;
  availableTypes: (AttributeType | string)[];
}) => {
  const { label, type, enumSet, subtype } = attribute;
  const typeChangeHandler = (type: AttributeType | string) => {
    let { subtype } = attribute;
    if (
      !(type === AttributeType.Collection || type === AttributeType.Optional)
    ) {
      subtype = undefined;
    }
    onChangeCallback({ ...attribute, type, subtype });
  };
  const subTypeChangeHandler = (subtype: AttributeType | string) => {
    onChangeCallback({ ...attribute, subtype });
  };
  const labelChangeHandler = (e: Event) => {
    if (
      e instanceof InputEvent &&
      e.currentTarget instanceof HTMLInputElement
    ) {
      console.log(e.currentTarget.value);
      const label = e.currentTarget.value;
      onChangeCallback({ ...attribute, label });
    }
  };
  return (
    <div>
      Attribute
      <div>Label:</div>
      <input placeholder={label} onInput={labelChangeHandler} />
      <TypeSelector
        availableTypes={availableTypes}
        type={type}
        onChange={typeChangeHandler}
      />
      {(type === AttributeType.Collection ||
        type === AttributeType.Optional) && (
        <div>
          Subtype:
          <TypeSelector
            availableTypes={availableTypes}
            type={type}
            onChange={subTypeChangeHandler}
          />
        </div>
      )}
    </div>
  );
};

const TypeSelector = ({
  availableTypes,
  type,
  onChange,
}: {
  availableTypes: (AttributeType | string)[];
  type: AttributeType | string;
  onChange: (type: AttributeType | string) => void;
}) => {
  const handleChange = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      onChange(e.currentTarget.value);
    }
  };
  return (
    <>
      <div>Type:</div>
      <select onChange={handleChange}>
        {availableTypes.map((el) => (
          <option value={el} selected={el === type}>
            {typeToDisplay(el)}
          </option>
        ))}
      </select>
    </>
  );
};

const typeToDisplay = (type: AttributeType | string) => type; // TODO
