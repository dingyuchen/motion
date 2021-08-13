import { useState } from "preact/hooks";

import {
  Attribute,
  AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";
import { AttributeDefinition, Schema } from "../shared/types";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";
import { StoreHandler } from "../shared/RuleStore";

export function ConsumerEdit(
  { schemaStr, handleBack, store }:
    {
      schemaStr: string;
      handleBack: (() => void);
      store: StoreHandler
    }) {
      
  const schema: Schema = schemaLookup(schemaStr)

  // init model from provided schema 
  const initialModel: Model = modelFromSchema(schema)

  const [model, setModel] = useState(initialModel)

  const handleChange = (newModel: Model) => {
    setModel(newModel)
  }

  return (
    <>
      <div className="mt-16">
        <div className="flex w-11/12">
          <button
            className="btn-danger px-4 text-md flex"
            onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </button>
          <div className="flex-1"></div>
          <button className="submit btn-good">Submit</button>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mb-4">CONSUMER VIEW</h1>
        <ModelCard model={model} onChange={handleChange} schema={schema} />
      </div>
      <div className="mt-12 flex justify-center">
        <button className="submit btn-good">Submit</button>
      </div>
    </>
  )
}

