import { Schema, AttributeDefinition, Rule, RuleSet } from "./types"
import { AttributeType, Model, Attribute, ModelFunc, BooleanFunc, Expression, CollectionFunc, IdentityFunc, NumberFunc } from "../../motion-bee/lib/types"
import { RuleStore } from "./RuleStore"

export function schemaLookup(schemaName: string) {    // dummy value to simulate lookup from store
  const groupSchema: Schema = {
    name: "Gathering",
    attributes: [
      { label: "Group", type: AttributeType.Collection, subtype: "Person" },
      { label: "All persons are from the same household", type: AttributeType.Boolean }
    ]
  }
  const personSchema: Schema = {
    name: "Person",
    attributes: [
      { label: "Age", type: AttributeType.Number },
      { label: "Is fully vaccinated", type: AttributeType.Boolean },
    ]
  }
  const insolvSchema: Schema = {
    name: "Insolvency",
    attributes: [
      { label: "Debt", type: AttributeType.Number },
      { label: "Written demand has been made to company's registered office, and the debtor has failed to pay, secure or compound the sum within 3 weeks", type: AttributeType.Boolean },
      { label: "Judgment has been issued in favor of a creditor, which has not been fully complied with", type: AttributeType.Boolean },
      { label: "Debtor is able to pay debt as it falls due", type: AttributeType.Boolean },
    ]
  }
  switch (schemaName) {
    case "Person": return personSchema
    case "Insolvency": return insolvSchema
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
    case AttributeType.Boolean: return ({ ...attr, value: true })
    case AttributeType.Number: return ({ ...attr, value: 0 })
    case AttributeType.Collection: return ({ ...attr, value: [] })
    default: return ({ ...attr, value: undefined })
  }
}


const groupSchema: Schema = {
  name: "Gathering",
  attributes: [
    { label: "Group", type: AttributeType.Collection, subtype: "Person" },
    { label: "All persons are from the same household", type: AttributeType.Boolean }
  ]
}
const personSchema: Schema = {
  name: "Person",
  attributes: [
    { label: "Age", type: AttributeType.Number },
    { label: "Is fully vaccinated", type: AttributeType.Boolean },
  ]
}

const isVaccinated: Expression = {
  args: [
    {
      args: ["vaccinated"],
      op: ModelFunc.Lookup,
    },
  ],
  op: BooleanFunc.IsChecked,
};

const allVaccinated: Expression = {
  args: [
    {
      args: ["Group"],
      op: ModelFunc.Lookup,
    },
    {
      args: [isVaccinated],
      op: IdentityFunc.Lambda,
    },
  ],
  op: CollectionFunc.AllOf,
};

const groupSize: Expression = {
  args: [
    {
      args: ["Group"],
      op: ModelFunc.Lookup,
    }
  ],
  op: CollectionFunc.NumberOf
}

const maxFive: Expression = {
  args: [
    groupSize, 5
  ],
  op: NumberFunc.LessThanOrEqual
}

const rule1: Rule = {
  expr: maxFive,
  input: groupSchema
}

const dineInRuleset: RuleSet = {
  title: "Dine In (12 Aug 2021 onwards)",
  rules: [rule1]
}

export const testRuleStore: RuleStore = {
  schemata: [groupSchema, personSchema],
  ruleSets: [dineInRuleset]
}