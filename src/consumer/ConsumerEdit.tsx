import { useState } from "preact/hooks";

import {
  Attribute,
  AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";
import { AttributeDefinition, Schema } from "../shared/types";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";

enum View {
  Edit = "edit",
  Select = "select",
}

type ConsumerEditProps = {
  schemaStr: string,
  handleBack: (() => void)
}

export function ConsumerEdit(props: ConsumerEditProps) {
  const schema: Schema = schemaLookup(props.schemaStr)

  // init model from provided schema 
  const initialModel: Model = modelFromSchema(schema)

  const [model, setModel] = useState(initialModel)

  const handleChange = (newModel: Model) => {
    setModel(newModel)
  }

  return (
    <>
      <div className="mt-16">
        <button
          className="border-2 w-48 py-4 px-4 text-lg hover:bg-indigo-600 hover:text-white text-center font-semibold"
          onClick={props.handleBack}>
          Back to scenario selection
        </button>
      </div>
      <div className="mt-4">
        <h1>CONSUMER VIEW</h1>
        <ModelCard model={model} onChange={handleChange} schema={schema} />
      </div>
      <div className="mt-12 flex justify-center">
        <button className="submit border-2 w-max px-4 py-4 cursor-pointer hover:bg-indigo-600 hover:text-white
      text-center font-semibold">Submit</button>
      </div>
    </>
  )
}

