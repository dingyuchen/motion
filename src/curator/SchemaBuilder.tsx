import { ReadSyncOptions } from "fs";
import { StateUpdater, useContext, useState } from "preact/hooks";
import { AttributeType } from "../../motion-bee/lib/types";
import {
  AttributeDefinition,
  defaultNewAttrDef,
  Schema,
} from "../shared/types";
import { immutableReplace } from "../shared/util";
import { subtypeContext } from "./SchemaEditor";

export const SchemaBuilder = ({
  schema,
  updateHandler,
  schemaSpace,
}: {
  schema: Schema;
  schemaSpace: (AttributeType)[];
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
    <div className="border-2 mt-12 px-12 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Schema builder</h1>
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
  availableTypes: (AttributeType)[];
}) => {
  const { label, type, enumSet, subtype } = attribute;
  const typeChangeHandler = (type: AttributeType) => {
    onChangeCallback({ ...attribute, type });
  };
  const subtypeChangeHandler = (subtype: string) => {
    onChangeCallback({ ...attribute, subtype })
  }
  const enumSetChangeHandler = (enumSet: string[]) => {
    onChangeCallback({ ...attribute, enumSet })
  }
  // const modelSubtypeChangeHandler = (subtype: string) => {
  //   onChangeCallback({ ...attribute, type: AttributeType.Model, subtype: subtype})
  // }
  const labelChangeHandler = (e: Event) => {
    // FIXME: label update
    if (
      e instanceof InputEvent &&
      e.currentTarget instanceof HTMLInputElement
    ) {
      // g(e.currentTarget.value);
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
      {type === AttributeType.Collection &&
        <SubtypeSelector onChange={subtypeChangeHandler} selected={attribute.subtype} />
      }
      {type === AttributeType.Enum &&
        <EnumSetSelector onChange={enumSetChangeHandler} values={attribute.enumSet} />
      }
    </div>
  );
};

const TypeSelector = ({
  availableTypes,
  type,
  onChange,
}: {
  availableTypes: (AttributeType)[];
  type: AttributeType;
  onChange: (type: AttributeType) => void;
}) => {

  const subtypeSpace = useContext(subtypeContext)
  const handleChange = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      onChange(+e.currentTarget.value);
    }
  };
  return (
    <div className="flex mt-2">
      <div className="w-48">Type:</div>
      <select onChange={handleChange} className="border-2" value={type}>
        {availableTypes.map((el) => (
          <option value={el} selected={el === type}>
            {typeToDisplay(el)}
          </option>
        ))}
        {/* {
          subtypeSpace.map((st) => (  //  FIXME: selected property not working
            <option value={st} selected={st === subtype}>
              bla
            </option>
          ))
        } */}
      </select>
    </div>
  );
};

const SubtypeSelector = ({
  selected,
  onChange
}: {
  selected: string | undefined
  onChange: (type: string) => void;
}) => {
  const subtypeSpace = useContext(subtypeContext)
  const handleChange = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      onChange(e.currentTarget.value);
    }
  };
  return (
    <div className="flex mt-2">
      <div className="w-48">Being a group of:</div>
      <select onChange={handleChange} value={selected} className="border-2">
        {subtypeSpace.map((x) => <option value={x}>{x}</option>)}
      </select>
    </div>
  );
};

const EnumSetSelector = ({
  values,
  onChange
}: {
  values: string[] | undefined;
  onChange: (type: string[]) => void;
}) => {
  const handleChange = (i: number, e: Event) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      const newValues = values != undefined ? [...values] : [""]
      newValues[i] = e.currentTarget.value
      onChange(newValues);
    }
  };

  const addOption = () => {
    if (values) {
      const newValues = [...values, ""]
      onChange(newValues)
    }
    else {
      const newValues = [""]
      onChange(newValues)
    }
  }

  return (
    <div>
      <div className="flex mt-2">
        <div className="w-48">With values:</div>
        <div className={values ? "mr-4" : ""}>
          {values?.map((x, i) =>
            <div>
              <input className="border-2" value={x} onInput={(e) => handleChange(i, e)}>{x}</input>
            </div>)}
        </div>
        <div onClick={addOption}    // fix the styling on this 
          className="border-2 h-8 px-4 cursor-pointer hover:bg-indigo-600 hover:text-white">
          Add new option
        </div>
      </div>
    </div>
  )
}

const typeToDisplay = (type: AttributeType | string) => {
  switch (type) {
    case AttributeType.Boolean: return "Yes / No"
    case AttributeType.Date: return "Date"
    case AttributeType.Enum: return "Option list"
    case AttributeType.Number: return "Number"
    case AttributeType.Collection: return "Group of other Schema(s)"
    // case AttributeType.Model: return "Model"
    case AttributeType.Optional: return "Optional value"
    default: return type
  }
}; // TODO
