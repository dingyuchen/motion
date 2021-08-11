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
  console.log(workingSchema)
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
    <div className="border-2 mt-12 px-12 py-8">
      <div>
        <h1 className="text-2xl">Schema builder</h1>
        <div className="mt-4">
          <input type="text" label="Name" placeholder="Name of schema" value={workingSchema.name}
          onInput={nameChangeHandler} 
          className="border-2 text-xl py-2 px-2" />
        </div>
        <h2 className="text-lg mt-6">Attributes:</h2>
        {attributes.map((attribute, index) => (
          <AttributeField
            attribute={attribute}
            availableTypes={schemaSpace}
            onChangeCallback={onChangeCallback(index)}
          />
        ))}
        <div className="mt-2">
          <button onClick={addNewBlankAttribute} className="border-2 mt-4 w-max px-4 py-4 cursor-pointer hover:bg-indigo-600 hover:text-white>
                text-center font-semibold">Add new attribute</button>
        </div>
      </div>
      <div>
        <button onClick={() => updateHandler(workingSchema)} className="border-2 mt-6 w-max px-4 py-4 cursor-pointer hover:bg-indigo-600 hover:text-white
        text-center font-semibold">SAVE</button>
        <button onClick={() => updateHandler(schema)} className="border-2 mt-6 ml-4 w-max px-4 py-4 cursor-pointer hover:bg-red-600 hover:text-white
        text-center font-semibold">EXIT WITHOUT SAVING</button>
      </div>
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
    onChangeCallback({ ...attribute, type });
  };
  const labelChangeHandler = (e: Event) => {
    // FIXME: label update
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
    <div className="border-2 mt-2 px-4 py-4">
      Attribute
      <div className="flex">
        <div className="w-48">Label:</div>
        <input className="border-2" value={label} onInput={labelChangeHandler} />
      </div>
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
              onChange={typeChangeHandler}
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
    <div className="flex mt-2">
      <div className="w-48">Type:</div>
      <select onChange={handleChange} className="border-2">
        {availableTypes.map((el) => (
          <option value={el} selected={el === type}>
            {typeToDisplay(el)}
          </option>
        ))}
      </select>
    </div>
  );
};

const typeToDisplay = (type: AttributeType | string) => {
  switch (type) {
    case AttributeType.Boolean: return "Yes / No"
    case AttributeType.Date: return "Date"
    case AttributeType.Enum: return "Option list"
    case AttributeType.Number: return "Number"
    case AttributeType.Collection: return "Group of other Schema(s)"
    case AttributeType.Model: return "Model"
    default: return type
  }
}; // TODO
