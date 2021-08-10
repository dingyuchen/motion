import { useState } from "preact/hooks";

import {
  Attribute,
  AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";
import { AttributeDefinition, Schema } from "../shared/types";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";

export function Consumer() {
  const schema: Schema = schemaLookup("Group")
  
  // init model from provided schema 
  const initialModel: Model = modelFromSchema(schema)

  const [model, setModel] = useState(initialModel)

  const handleChange = (newModel: Model) => {
    setModel(newModel)
    console.log("updated model:")
    console.log(newModel)
  }

  return (
    <>
      <div className="mt-16">
        <h1>CONSUMER VIEW</h1>
        <ModelCard model={model} onChange={handleChange} schema={schema} />
      </div>
    </>
  )
}

