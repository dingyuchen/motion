import { StateUpdater, useContext, useState } from "preact/hooks";
import { AttributeType, defaultTypes } from "../../motion-bee/lib/types";
import { RuleStoreContext } from "../app";
import { AttributeDefinition, defaultNewAttrDef, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";

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
    setWorkingSchema((prev) => ({ ...prev, attributes: newAttributeList }));
  };
  const onChange = (index: number) => (attribute: AttributeDefinition) => {
    setWorkingSchema((prev) => {
      const { attributes } = prev;
      return {
        ...prev,
        attributes: immutableReplace(attributes, index, attribute),
      };
    });
  };
  const onDelete = (index: number) => {
    setWorkingSchema((prev) => {
      const { attributes } = prev;
      return {
        ...prev,
        attributes: attributes.splice(index, 1),
      };
    });
  };
  const nameChangeHandler = (e: Event) => {
    if (e instanceof InputEvent && e.currentTarget instanceof HTMLInputElement) {
      const name = e.currentTarget.value;
      setWorkingSchema((prev) => ({ ...prev, name }));
    }
  };
  const onSubmit = (e: Event, workingSchema: Schema) => {
    e.preventDefault()
    updateHandler(workingSchema)
  };


  return (
    <div className="card my-12 px-12 py-8">
      <form onSubmit={(e: Event) => onSubmit(e, workingSchema)}>
        <div>
          <h1 className="text-2xl font-semibold">Schema builder</h1>
          <div className="mt-4">
            <input
              required
              type="text"
              label="Name"
              placeholder="Name of schema"
              value={workingSchema.name}
              onInput={nameChangeHandler}
              className="border-2 text-xl py-2 px-2"
            />
          </div>
          <h2 className="text-lg mt-6 font-semibold">Attributes:</h2>
          {attributes.map((attribute, index) => (
            <AttributeField attribute={attribute} onChange={onChange(index)} onDelete={() => onDelete(index)} />
          ))}
          <div className="mt-2">
            <button onClick={addNewBlankAttribute} className="btn-primary mt-4">Add new attribute</button>
          </div>
        </div>
        <div className="mt-8 border-t-2 flex">
          <button type="submit" className="mt-6 btn-good flex content-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            SAVE
          </button>
          <button onClick={() => updateHandler(schema)} className="btn-danger mt-6 ml-4">EXIT WITHOUT SAVING</button>
        </div>
      </form>
    </div>
  );
};

const AttributeField = ({
  attribute,
  onChange,
  onDelete,
}: {
  attribute: AttributeDefinition;
  onChange: (attribute: AttributeDefinition) => void;
  onDelete: () => void;
}) => {
  const { label, type, enumSet, subtype } = attribute;
  const typeChangeHandler = (type: AttributeType) => {
    onChange({ ...attribute, type });
  };
  const subtypeChangeHandler = (subtype: string) => {
    onChange({ ...attribute, subtype });
  };
  const enumSetChangeHandler = (enumSet: string[]) => {
    onChange({ ...attribute, enumSet });
  };
  // const modelSubtypeChangeHandler = (subtype: string) => {
  //   onChangeCallback({ ...attribute, type: AttributeType.Model, subtype: subtype})
  // }
  const labelChangeHandler = (e: Event) => {
    if (e instanceof InputEvent && e.currentTarget instanceof HTMLInputElement) {
      // g(e.currentTarget.value);
      const label = e.currentTarget.value;
      onChange({ ...attribute, label });
    }
  };
  return (
    <div className="card border-t-2 mt-2 px-4 py-4 flex">
      <div className="flex-1">
        <div className="flex">
          <div className="w-48">Label:</div>
          <input className="border-2" value={label} required onInput={labelChangeHandler} />
        </div>
        <TypeSelector availableTypes={defaultTypes} type={type} onChange={typeChangeHandler} />
        {type === AttributeType.Collection && (
          <SubtypeSelector onChange={subtypeChangeHandler} selected={attribute.subtype} />
        )}
        {type === AttributeType.Enum && <EnumSetSelector onChange={enumSetChangeHandler} values={attribute.enumSet} />}

      </div>
      <div className="w-10">
        <button onClick={onDelete} className="btn-neutral p-2" title="Delete this attribute">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TypeSelector = ({
  availableTypes,
  type,
  onChange,
}: {
  availableTypes: AttributeType[];
  type: AttributeType;
  onChange: (type: AttributeType) => void;
}) => {
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
  onChange,
}: {
  selected: string | undefined;
  onChange: (type: string) => void;
}) => {
  const schemaSpace = useContext(RuleStoreContext).getSchemata;
  const handleChange = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      onChange(e.currentTarget.value);
    }
  };
  return (
    <div className="flex mt-2">
      <div className="w-48">Being a group of:</div>
      <select onChange={handleChange} value={selected} className="border-2">
        {schemaSpace
          .map((schema) => schema.name)
          .map((x) => (
            <option value={x}>{x}</option>
          ))}
      </select>
    </div>
  );
};

const EnumSetSelector = ({
  values,
  onChange,
}: {
  values: string[] | undefined;
  onChange: (type: string[]) => void;
}) => {
  const handleChange = (i: number, e: Event) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      const newValues = values !== undefined ? [...values] : [""];
      newValues[i] = e.currentTarget.value;
      onChange(newValues);
    }
  };

  const addOption = () => {
    if (values) {
      const newValues = [...values, ""];
      onChange(newValues);
    } else {
      const newValues = [""];
      onChange(newValues);
    }
  };

  return (
    <div>
      <div className="flex mt-2">
        <div className="w-48">With values:</div>
        <div className={values ? "mr-4" : ""}>
          {values?.map((x, i) => (
            <div className="flex-1 w-96">
              <input className="border-2 w-96" required value={x} onInput={(e) => handleChange(i, e)}>
                {x}
              </input>
            </div>
          ))}
        </div>
        <button onClick={addOption}    // fix the styling on this 
          className="btn-primary px-4 h-12">
          <span className="">Add new option</span>
        </button>
      </div>
    </div>
  );
};

const typeToDisplay = (type: AttributeType | string) => {
  switch (type) {
    case AttributeType.Boolean:
      return "Yes / No";
    case AttributeType.Date:
      return "Date";
    case AttributeType.Enum:
      return "Option list";
    case AttributeType.Number:
      return "Number";
    case AttributeType.Collection:
      return "Group of other Schema(s)";
    // case AttributeType.Model: return "Model"
    case AttributeType.Optional:
      return "Optional value";
    default:
      return type;
  }
}; // TODO
