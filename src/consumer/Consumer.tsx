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
  
  // defined model for testing purposes 
  const charlie: Model = {
    attributes: [
      { label: "vaccinated", type: AttributeType.Boolean, value: true },
      { label: "age", type: AttributeType.Number, value: 90 },
    ],
    type: AttributeType.Model,
    label: "person",
  };
  const daniel: Model = {
    attributes: [
      { label: "vaccinated", type: AttributeType.Boolean, value: false },
      { label: "age", type: AttributeType.Number, value: 30 },
    ],
    type: AttributeType.Model,
    label: "person",
  };
  const groupInstance: Model = {
    attributes: [
      {
        label: "Group",
        type: AttributeType.Collection,
        value: [charlie, daniel],
      },
      { label: "same household", type: AttributeType.Boolean, value: true },
    ],
    type: AttributeType.Model,
    label: "group",
  };

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

