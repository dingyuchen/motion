import {
  Attribute,
  AttributeType,
  Model
} from "../../motion-bee/lib/types";
import { Schema, AttributeDefinition } from "../shared/types";

import { useState } from "preact/hooks";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";
import { JSX } from "preact";
import { StoreHandler } from "../shared/RuleStore";

export function ModelCard({model, schema, onChange, store} : {
  model: Model;
  schema: Schema;
  onChange: (newModel: Model) => void; 
  store: StoreHandler
}) {   // need help typing these

  const handleChange = (e: any) => {      // type???? 
    // console.log(e.currentTarget.name + ": " + e.currentTarget.value)
    const newAttributes = [...model.attributes]
    const index = model.attributes.findIndex((obj: Attribute) => obj.label === e.currentTarget.name)
    newAttributes[index] = { ...newAttributes[index], value: e.currentTarget.value }
    onChange({ ...model, attributes: newAttributes })
  }

  const handleBoolChange = (e: any) => {
    const toBool = e.currentTarget.value === "true"
    const newAttributes = [...model.attributes]
    const index = model.attributes.findIndex((obj: Attribute) => obj.label === e.currentTarget.name)
    newAttributes[index] = { ...newAttributes[index], value: toBool }
    onChange({ ...model, attributes: newAttributes })
  }

  const handleNumberChange = (e: any) => {
    const newAttributes = [...model.attributes]
    const index = model.attributes.findIndex((obj: Attribute) => obj.label === e.currentTarget.name)
    newAttributes[index] = { ...newAttributes[index], value: parseInt(e.currentTarget.value) }
    onChange({ ...model, attributes: newAttributes })
  }

  const handleDateChange = (e: any) => {
    const newAttributes = [...model.attributes]
    const index = model.attributes.findIndex((obj: Attribute) => obj.label === e.currentTarget.name)
    newAttributes[index] = { ...newAttributes[index], value: Date.parse(e.currentTarget.value) }
    onChange({ ...model, attributes: newAttributes })
  }

  const handleCollectionChange = (data: Model[], model: Model, label: string) => {
    const newAttributes = model.attributes.slice();

    const index = model.attributes.findIndex((obj => obj.label === label))
    newAttributes[index] = { ...newAttributes[index], value: data }
    onChange({ ...model, attributes: newAttributes })
  }

  const children = [];
  for (let attribute of model.attributes) {
    if (attribute.type === AttributeType.Collection) {
      // lookup subschema based on attribute label
      const subSchemaLabel = schema.attributes.find((schemaAttr: AttributeDefinition) => schemaAttr.label === attribute.label)!.subtype!
      const subSchema = schemaLookup(store, subSchemaLabel)
      const collectionLabel = attribute.label

      let childValues = { value: attribute.value };
      children.push(
        <Collection
          {...childValues}
          onChange={(data: Model[]) => handleCollectionChange(data, model, attribute.label)}
          subSchema={subSchema}
          collectionLabel={collectionLabel}
        />
      );
    }
    if (attribute.type === AttributeType.Boolean) {
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <select className="border-2 pl-2 text-sm font-semibold py-2" onChange={handleBoolChange} name={attribute.label} value={attribute.value!.toString()}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      );
    }
    if (attribute.type === AttributeType.Number && typeof(attribute.value) === "number") {
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <input type="number" className="border-2 pl-2 text-sm font-semibold py-2" onChange={handleNumberChange} name={attribute.label} value={attribute.value} />
        </div>
      );
    }
    if (attribute.type === AttributeType.Enum && typeof attribute.value === "string") {
      const enumSet = schema.attributes.find((schemaAttr: AttributeDefinition) => schemaAttr.label === attribute.label)!.enumSet!
      const enumOptions = enumSet.map((option: string) => <option value={option}>{option}</option>)
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <select className="border-2 pl-2 text-sm font-semibold py-2" value={attribute.value} onChange={handleChange} name={attribute.label}>
            {enumOptions}
          </select>
        </div>
      );
    }
    if (attribute.type === AttributeType.Date && (typeof(attribute.value) === "string" || typeof attribute.value === "undefined")) {
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <input type="date" className="border-2 pl-2 text-sm font-semibold py-2" onChange={handleDateChange} name={attribute.label} value={attribute.value} />
        </div>
      );
    }
  }

  return (
    <>
      <div class="w-11/12 min-w-max card border-2 p-4 ml-1">
        <h1 class="text-2xl border-gray-300 text-gray-900 text-left">{model.label}</h1>
        {children}
      </div>
    </>
  );
}

const Collection = (props: any) => {    
  const subSchema = props.subSchema
  const children = []
  const store = props.store

  const handleSubChange = (data: Model, props: any, i: number) => {
    //  shallow copy array from props to pass up (may need refactoring)
    const newArray = props.value.slice();
    newArray[i] = data;
    props.onChange(newArray);
  };

  const newSubModel = () => {
    console.log("new submodel");
    const newArray = props.value.slice();
    newArray.push(modelFromSchema(subSchema));
    props.onChange(newArray);
  };

  const deleteSubModel = (index: number) => {
    const newArray = props.value.slice();
    newArray.splice(index, 1);
    props.onChange(newArray);
  };

  for (const [i, child] of props.value.entries()) {
    children.push(
      <div className="flex" key={i}>
        <div className="text-lg w-24 flex flex-col justify-center items-center">
          {i + 1}
          <div className= "btn-neutral text-sm font-semibold py-2 px-2 mt-10" 
          onClick={() => deleteSubModel(i)}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg></div>
        </div>
        <div className="flex-1">
          <ModelCard model={child} onChange={(data: any) => handleSubChange(data, props, i)} schema={subSchema} store={store}/>
        </div>
      </div>
    );
  }
  return (
    <div className="border-2 p-4 my-4 card">
      <div className="mt-2">
        <h2 className="text-lg mb-2">
          {props.collectionLabel} (a group consisting of multiple {props.subSchema.name})
        </h2>
        {children}
      </div>
      <div className="addSubModel mt-6 w-max btn-primary" onClick={newSubModel}>
        Add new {props.subSchema.name}
      </div>
    </div>
  );
};
