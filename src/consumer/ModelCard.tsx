import {
  AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { useState } from "preact/hooks"
import { JSX } from "preact";

// cases left - enum 

export function ModelCard(props: any) {   // need help typing these
  const model = props.model  

  const handleChange = (e: any) => {      // type???? 
    console.log(e.currentTarget.name + ": " + e.currentTarget.value)
    const newAttributes = model.attributes.slice()
    const index = model.attributes.findIndex(((obj:Model) => obj.label === e.currentTarget.name))
    newAttributes[index] = {...newAttributes[index], value: e.currentTarget.value}
    // console.log({...model, attributes: newAttributes})
    props.onChange({...model, attributes: newAttributes})
  }
  
  const handleCollectionChange = (data: Model[], model: Model, label: string) => {
    const newAttributes = model.attributes.slice()
    
    const index = model.attributes.findIndex((obj => obj.label === label))
    newAttributes[index] = {...newAttributes[index], value: data}
    props.onChange({...model, attributes: newAttributes})
    
    // console.log({...model, attributes: newAttributes})
  }
  
  const children = []
  for (let attribute of model.attributes) {
    if (attribute.type === AttributeType.Collection) {
      let childValues = { value: attribute.value }
      children.push(<Collection {...childValues} onChange={(data: Model[]) => handleCollectionChange(data, model, attribute.label)}/>)
    }
    if (attribute.type ===AttributeType.Boolean) {
      children.push(
        <div>
          <h2 className="text-lg inline">{attribute.label}</h2>
          <select className="border-2" onChange={handleChange} name={attribute.label}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      )
    }
    if (attribute.type ===AttributeType.Number) {
      children.push(
        <div>
          <h2 className="text-lg inline">{attribute.label}</h2>
          <input type="number" className="border-2" onChange={handleChange} name={attribute.label}/>
        </div>
      )
    }
    if (attribute.type ===AttributeType.Enum) {   // TODO
      children.push(
        <div>
          <h2 className="text-lg inline">{attribute.label}</h2>
          <select></select>
        </div>
      )
    }
  }
  
  return (
    <>
      <div class="w-11/12 min-w-max bg-white p-4 ml-1 border-2">
        <h1 class="text-2xl border-gray-300 text-gray-900 text-left">{model.label}</h1>
        {children}
      </div>
    </>
  )
}

const Collection = (props: any) => {    // what type is props ah wtf - AttributeType.Collection? but get err
  const children = []

  const handleSubChange = (data: Model, props: any, i: number) => {
    //  shallow copy array from props to pass up (may need refactoring)
    const newArray = props.value.slice()
    newArray[i] = data
    props.onChange(newArray)
  }

  for (const [i, child] of props.value.entries()) {
    children.push(
      <div className="flex">
        <div className="text-lg w-16 border-2 flex justify-center items-center">{i}</div>
        <div className="flex-1">
          <ModelCard model={child} onChange={(data: any) => handleSubChange(data, props, i)}/>
        </div>
      </div>
    )
  }
  return (
    <div className="border-2 p-4 my-4">
      <h2 className="text-lg">Collection of {props.value[0].label}</h2>
      {children}
    </div>
  )
}