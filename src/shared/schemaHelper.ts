import { Schema, AttributeDefinition } from "./types"
import { AttributeType, Model, Attribute } from "../../motion-bee/lib/types"

export function schemaLookup (schemaName: string)  {    // dummy value to simulate lookup from store
  const groupSchema: Schema = {
    name: "Gathering",
    attributes: [
      { label: "Group", type: AttributeType.Collection, subtype: "Person" },
      { label: "All from same household", type: AttributeType.Boolean }
    ]
  }
  const personSchema: Schema = {
    name: "Person",
    attributes: [
      { label: "Age", type: AttributeType.Number },
      { label: "Is fully vaccinated", type: AttributeType.Boolean }
    ]
  }
  switch (schemaName) {
    case "Person": return personSchema
    default: return groupSchema
  }
}

export function modelFromSchema(schema: Schema): Model {
  return {
    label: schema.name,
    attributes: schema.attributes.map((x) => setDefaultAttrs(x)),
    type: AttributeType.Model
  }
}

const setDefaultAttrs = (attr: AttributeDefinition): Attribute => {
  switch (attr.type) {
    case AttributeType.Boolean: return ({...attr, value: true})
    case AttributeType.Number: return ({...attr, value: 0})
    case AttributeType.Collection: return ({...attr, value: []})
    default: return ({...attr, value: undefined})
  }
}