import {
  AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { useState } from "preact/hooks"

export function ModelCard(props: any) {   // need help typing these
  console.log(props)
  const [model, setModel] = useState(props)
  const children = []
  for (let attribute of model.attributes) {
    if (attribute.type === AttributeType.Collection) {
      let childValues = { value: attribute.value }
      children.push(<Collection {...childValues} />)
    }
    if (attribute.type ===AttributeType.Boolean) {
      children.push(
        <div>
          <h2 className="text-lg inline">{attribute.label}</h2>
          <select className="border-2">
            <option>True</option>
            <option>False</option>
          </select>
        </div>
      )
    }
    if (attribute.type ===AttributeType.Number) {
      children.push(
        <div>
          <h2 className="text-lg inline">{attribute.label}</h2>
          <input type="number" className="border-2"/>
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

const Collection = (props: any) => {    // what type is props ah wtf 
  const children = []
  for (const [i, child] of props.value.entries()) {
    children.push(
      <div className="flex">
        <div className="text-lg w-16 border-2 flex justify-center items-center">{i}</div>
        <div className="flex-1">
          <ModelCard {...child} />
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