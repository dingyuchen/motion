import { useState } from "preact/hooks";

import {
AttributeType,
  Model
} from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";

export function Consumer() {

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
        label: "group",
        type: AttributeType.Collection,
        value: [charlie, daniel],
      },
      { label: "same household", type: AttributeType.Boolean, value: true },
    ],
    type: AttributeType.Model,
    label: "group",
  };

  const [model, setModel] = useState(groupInstance)

  const handleChange = (model: Model) => {
    setModel(model)
    console.log("updated model:")
    console.log(model)
  }

  return (
  <>
    <div className="mt-16">
      <h1>CONSUMER VIEW</h1>
        <ModelCard model={model} onChange={handleChange}/>
    </div>
  </>
  )
}

