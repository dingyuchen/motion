import { useState } from "preact/hooks";

import {
  Attribute,
  AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";
import { ConsumerEdit } from "./ConsumerEdit";
import { AttributeDefinition, Schema } from "../shared/types";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";

enum View {
  Edit = "edit",
  Select = "select",
}

// for testing 
const schemaList: string[] = ["Group", "Insolvency"]

export function Consumer() {
  const [schemaStr, setSchemaStr] = useState("Group")
  const schema: Schema = schemaLookup("Group")
  const [view, setView] = useState(View.Select)

  const handleSchemaChange = (schemaOption: string) => {
    setSchemaStr(schemaOption)
    setView(View.Edit)
  }

  const handleReturnToView = () => {
    setView(View.Select)
  }

  const showComponent = (viewMode: View, handleClick: ((s: string) => void)) => { 
    switch (viewMode) {
      case View.Edit:
        return <ConsumerEdit schemaStr={schemaStr} handleBack={handleReturnToView}/>;
      case View.Select:
        const schemaDivs = []
        for (let schemaOption of schemaList) {    // TEMPORARY - REDO THIS WHEN SCHEMA STORE IS IMPLEMENTED
          schemaDivs.push(
            <div className="w-72 flex border-2 py-12 justify-center content-evenly text-2xl cursor-pointer hover:bg-indigo-600 hover:text-white"
            name={schemaOption}
            onClick={() => handleClick(schemaOption)}>
              {schemaOption}
            </div>
          )
        }
        return (
          <>
            <h1 class="text-2xl border-gray-300 text-gray-900 mt-16">Select a situation to get started.</h1>
            <div class="w-11/12 mt-16 bg-white p-4 ml-1 border-2 flex justify-evenly">
              {schemaDivs}
            </div>
          </>
        );
    }
  };
  // init model from provided schema 
  const initialModel: Model = modelFromSchema(schema)

  return (
    <div className="px-24">
      {showComponent(view, handleSchemaChange)}
    </div>
  )
}
