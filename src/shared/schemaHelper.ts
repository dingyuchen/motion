import { Schema, AttributeDefinition, Rule, RuleSet } from "./types"
import { AttributeType, Model, Attribute, ModelFunc, BooleanFunc, Expression, CollectionFunc, IdentityFunc, NumberFunc, LogicalFunc, Expr, EnumFunc } from "../../motion-bee/lib/types"
import { RuleStore, StoreHandler } from "./RuleStore"

export function schemaLookup(store: StoreHandler, schemaName: string): Schema | undefined {    // dummy value to simulate lookup from store
  const schemata = store.getSchemata
  return schemata.find(schema => schema.name === schemaName)
}

export function modelFromSchema(schema: Schema): Model {
  return {
    label: schema.name,
    attributes: schema.attributes.map((x) => setDefaultAttrs(x)),
    type: AttributeType.Model,
  };
}

const setDefaultAttrs = (attr: AttributeDefinition): Attribute => {
  switch (attr.type) {
    case AttributeType.Boolean: return ({ ...attr, value: true })
    case AttributeType.Number: return ({ ...attr, value: 0 })
    case AttributeType.Collection: return ({ ...attr, value: [] })
    case AttributeType.Enum: {
      const {enumSet, ...newAttr} = attr
      return ({ ...newAttr, value: attr.enumSet![0] })
    }
    default: return ({ ...attr, value: undefined })
  }
}


// DINE IN EXAMPLE (INCOMPLETE RULES)
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
    // { label: "Type of vaccine", type: AttributeType.Enum, enumSet:["Moderna", "Pfizer", "Sinovac"] }
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

const maxFiveVax: Expression = {
  args: [{
    args: [groupSize, 5],
    op: NumberFunc.LessThanOrEqual
  }, allVaccinated],
  op: LogicalFunc.And
}

const rule1: Rule = {
  expr: maxFiveVax,
  input: groupSchema
}

export const dineInRuleset: RuleSet = {
  title: "Dine In (12 Aug 2021 onwards) - TESTING (incomplete)",
  rules: [rule1]
}

// MICE EVENT PILOTS (https://www.stb.gov.sg/content/stb/en/home-pages/advisory-for-MICE.html)
const miceSchema: Schema = {
  name: "MICE event pilots",
  attributes: [
    {
      label: "Participants are all fully vaccinated",
      type: AttributeType.Boolean
    },
    {
      label: "Type of event",
      type: AttributeType.Enum,
      enumSet: ["Participants are predominantly seated or standing in a fixed position during the session.",
        "Participants are predominantly non-seated and moving about during the session."]
    },
    {
      label: "Number of participants",
      type: AttributeType.Number
    }
  ]
}

const unvax50: Expr = {
  args: [
    {
      args: [{ args: ["Participants are all fully vaccinated"], op: ModelFunc.Lookup }], op: BooleanFunc.IsNotChecked
    },
    { args: [{args: ["Number of participants"], op: ModelFunc.Lookup}, 50],
    op: NumberFunc.LessThanOrEqual }
  ],
  op: LogicalFunc.And
}
const fixed500: Expr = {
  args: [
    {
      args: [{ args: ["Participants are all fully vaccinated"], op: ModelFunc.Lookup }], op: BooleanFunc.IsChecked
    },
    {
      args: [{ args: ["Type of event"], op: ModelFunc.Lookup }, "Participants are predominantly seated or standing in a fixed position during the session."], op: EnumFunc.Is
    },
    { args: [{args: ["Number of participants"], op: ModelFunc.Lookup}, 500], op: NumberFunc.LessThanOrEqual }
  ],
  op: LogicalFunc.And
}
const moving250: Expr = {
  args: [
    {
      args: [{ args: ["Participants are all fully vaccinated"], op: ModelFunc.Lookup }], op: BooleanFunc.IsChecked
    },
    {
      args: [{ args: ["Type of event"], op: ModelFunc.Lookup }, "Participants are predominantly non-seated and moving about during the session."], op: EnumFunc.Is
    },
    { args: [{args: ["Number of participants"], op: ModelFunc.Lookup}, 250], op: NumberFunc.LessThanOrEqual }
  ],
  op: LogicalFunc.And
}

export const miceRuleset: RuleSet = {
  title: "MICE event pilots",
  rules: [{
    expr: {args: [unvax50, fixed500, moving250], op: LogicalFunc.Or},
    input: miceSchema
  }]
}

export const testRuleStore: RuleStore = {
  schemata: [groupSchema, personSchema, miceSchema],
  ruleSets: [dineInRuleset, miceRuleset]
}
