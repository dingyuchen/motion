import {
  AttributeType,
  Model
} from "../../motion-bee/lib/types";
import { Schema, AttributeDefinition } from "../shared/types";

import { useState } from "preact/hooks"
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";
import { JSX } from "preact";

export function ModelCard(props: any) {   // need help typing these
  const model = props.model
  const schema = props.schema
  // console.log(model)

  const handleChange = (e: any) => {      // type???? 
    console.log(e.currentTarget.name + ": " + e.currentTarget.value)
    const newAttributes = model.attributes.slice()
    const index = model.attributes.findIndex(((obj: Model) => obj.label === e.currentTarget.name))
    newAttributes[index] = { ...newAttributes[index], value: e.currentTarget.value }
    props.onChange({ ...model, attributes: newAttributes })
  }

  const handleCollectionChange = (data: Model[], model: Model, label: string) => {
    const newAttributes = model.attributes.slice()

    const index = model.attributes.findIndex((obj => obj.label === label))
    newAttributes[index] = { ...newAttributes[index], value: data }
    props.onChange({ ...model, attributes: newAttributes })
  }

  const children = []
  for (let attribute of model.attributes) {
    if (attribute.type === AttributeType.Collection) {

      // lookup subschema based on attribute label
      const subSchemaLabel: string = schema.attributes.find((schemaAttr: AttributeDefinition) => schemaAttr.label === attribute.label).subtype
      const subSchema = schemaLookup(subSchemaLabel)
      const collectionLabel = attribute.label

      let childValues = { value: attribute.value }
      children.push(
        <Collection {...childValues}
          onChange={(data: Model[]) => handleCollectionChange(data, model, attribute.label)}
          subSchema={subSchema}
          collectionLabel={collectionLabel} />)
    }
    if (attribute.type === AttributeType.Boolean) {
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <select className="border-2 pl-2 text-sm font-semibold py-2" onChange={handleChange} name={attribute.label} value={attribute.value}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      )
    }
    if (attribute.type === AttributeType.Number) {
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <input type="number" className="border-2 pl-2 text-sm font-semibold py-2" onChange={handleChange} name={attribute.label} value={attribute.value} />
        </div>
      )
    }
    if (attribute.type === AttributeType.Enum) {
      const enumSet = schema.attributes.find((schemaAttr: AttributeDefinition) => schemaAttr.label === attribute.label).enumSet
      const enumOptions = enumSet.map((option: string) => <option value={option}>{option}</option>)
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <select className="border-2 pl-2 text-sm font-semibold py-2" value={attribute.value} onChange={handleChange} name={attribute.label}>
            {enumOptions}
          </select>
        </div>
      )
    }
    if (attribute.type === AttributeType.Date) {
      children.push(
        <div className="flex mt-2">
          <h2 className="text-lg inline w-1/4">{attribute.label}</h2>
          <input type="date" className="border-2 pl-2 text-sm font-semibold py-2" onChange={handleChange} name={attribute.label} value={attribute.value} />
        </div>
      )
    }
  }

  return (
    <>
      <div class="w-11/12 min-w-max card border-2 p-4 ml-1">
        <h1 class="text-2xl border-gray-300 text-gray-900 text-left">{model.label}</h1>
        {children}
      </div>
    </>
  )
}

const Collection = (props: any) => {    
  const subSchema = props.subSchema
  console.log("props value")
  console.log(props.value)
  const children = []

  const handleSubChange = (data: Model, props: any, i: number) => {
    //  shallow copy array from props to pass up (may need refactoring)
    const newArray = props.value.slice()
    newArray[i] = data
    props.onChange(newArray)
  }

  const newSubModel = () => {
    console.log("new submodel")
    const newArray = props.value.slice()
    newArray.push(modelFromSchema(subSchema))
    props.onChange(newArray)
  }

  const deleteSubModel = (index: number) => {
    const newArray = props.value.slice()
    newArray.splice(index, 1)
    props.onChange(newArray)
  }

  for (const [i, child] of props.value.entries()) {
    children.push(
      <div className="flex" key={i}>
        <div className="text-lg w-24 flex flex-col justify-center items-center">
          {i + 1}
          <div className= "btn-danger text-sm font-semibold py-2 px-2 mt-10" 
          onClick={() => deleteSubModel(i)}>Delete</div>
        </div>
        <div className="flex-1">
          <ModelCard model={child} onChange={(data: any) => handleSubChange(data, props, i)} schema={subSchema} />
        </div>
      </div>
    )
  }
  return (
    <div className="border-2 p-4 my-4 card">
      <div className="mt-2">
        <h2 className="text-lg mb-2">{props.collectionLabel} (a group consisting of multiple {props.subSchema.name})</h2>
        {children}
      </div>
      <div className="addSubModel mt-6 w-max btn-primary" onClick={newSubModel}>
        Add new {props.subSchema.name}
      </div>
    </div>
  )
}