import { AttributeType } from "../../motion-bee/lib/types";
import { RuleSet, Schema } from "./types";
import { miceRuleset } from "./schemaHelper";

export interface RuleStore {
  schemata: Schema[];
  ruleSets: RuleSet[];
}

export class StoreHandler {
  setFn: (_: RuleStore) => void;
  ruleStore: RuleStore;
  constructor(curr: RuleStore, setFn: (_: RuleStore) => void) {
    this.setFn = setFn;
    this.ruleStore = curr;
  }

  // not used
  addSchema = (schema: Schema) => {
    const schemata = this.ruleStore.schemata.concat(schema);
    this.setFn({ ...this.ruleStore, schemata });
  };

  editSchema = (index: number, schema: Schema) => {
    let schemata = this.ruleStore.schemata.slice();
    schemata[index] = schema;
    this.setFn({ ...this.ruleStore, schemata });
  };

  editRuleSet = (index: number, ruleSet: RuleSet) => {
    let ruleSets = this.ruleStore.ruleSets.slice();
    ruleSets[index] = ruleSet;
    this.setFn({ ...this.ruleStore, ruleSets });
  };

  getSchema = (schemaName: string) => {
    const res = this.ruleStore.schemata.find((schema) => schema.name === schemaName);
    if (res === undefined) {
      throw new Error("schema not in rulestore");
    }
    return res;
  };

  get getSchemata() {
    return this.ruleStore.schemata;
  }

  get getRuleSets() {
    return this.ruleStore.ruleSets;
  }
}

const dineInRuleSetNew = {
  rules: [
    {
      input: {
        index: 1,
        name: "Dine-In",
        attributes: [
          { label: "F&B Establishment ", type: 3 },
          { label: "Number Of Person", type: 1 },
          { label: "Adults", type: 4, subtype: "Person" },
          { label: "Children", type: 4, subtype: "Person" },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Children Same Household", type: 3 },
        ],
      },
      expr: {
        args: [
          {
            args: [
              { args: ["Adults"], op: "Lookup" },
              { args: [{ args: ["Is fully vaccinated"], op: "Lookup" }], op: "IsChecked" },
            ],
            op: "AllOf",
          },
          { args: [{ args: [{ args: ["Children"], op: "Lookup" }], op: "Size" }, 0], op: "Equal" },
          { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Restaurant"], op: "Is" },
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 5], op: "LessThanOrEqual" },
        ],
        op: "And",
      },
    },
    {
      input: {
        name: "Dine-In",
        attributes: [
          { label: "F&B Establishment ", type: 3 },
          { label: "Number Of Person", type: 1 },
          { label: "Adults", type: 4, subtype: "Person" },
          { label: "Children", type: 4, subtype: "Person" },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Children Same Household", type: 3 },
        ],
      },
      expr: {
        args: [
          {
            args: [
              { args: ["Adults"], op: "Lookup" },
              { args: [{ args: ["Is fully vaccinated"], op: "Lookup" }], op: "IsChecked" },
            ],
            op: "AllOf",
          },
          { args: [{ args: [{ args: ["Children"], op: "Lookup" }], op: "Size" }, 5], op: "LessThanOrEqual" },
          { args: [{ args: [{ args: ["Adults"], op: "Lookup" }], op: "Size" }, 5], op: "LessThanOrEqual" },
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 5], op: "LessThanOrEqual" },
          { args: [{ args: ["Children Same Household"], op: "Lookup" }], op: "IsChecked" },
          { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Restaurant"], op: "Is" },
        ],
        op: "And",
      },
    },
    {
      input: {
        name: "Dine-In",
        attributes: [
          { label: "F&B Establishment ", type: 3 },
          { label: "Number Of Person", type: 1 },
          { label: "Adults", type: 4, subtype: "Person" },
          { label: "Children", type: 4, subtype: "Person" },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Children Same Household", type: 3 },
        ],
      },
      expr: {
        args: [
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 2], op: "LessThanOrEqual" },
          {
            args: [
              { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Hawker Centre"], op: "Is" },
              { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Coffee Shop"], op: "Is" },
            ],
            op: "Or",
          },
        ],
        op: "And",
      },
    },
  ],
  title: "Dine In",
};

export const blankRuleStore = (): RuleStore => ({
  schemata: [
    {
      name: "Gathering",
      attributes: [
        { label: "Group", type: AttributeType.Collection, subtype: "Person" },
        { label: "All from same household", type: AttributeType.Boolean },
      ],
    },
    {
      name: "Dine-In",
      attributes: [
        { label: "F&B Establishment ", type: 3 },
        { label: "Number Of Person", type: 1 },
        { label: "Adults", type: 4, subtype: "Person" },
        { label: "Children", type: 4, subtype: "Person" },
        { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
        { label: "Children Same Household", type: 3 },
      ],
    },
    {
      name: "Person",
      attributes: [
        { label: "Age", type: AttributeType.Number },
        { label: "Is fully vaccinated", type: AttributeType.Boolean },
        { label: "Type of vaccine", type: AttributeType.Enum, enumSet: ["Pfizer", "Moderna", "Sinovac", "Other"] },
        { label: "Date of vaccination", type: AttributeType.Date },
        // { label: "Children", type: AttributeType.Collection, subtype:"Person"}
      ],
    },
    {
      name: "MICE event pilots",
      attributes: [
        {
          label: "Participants are all fully vaccinated",
          type: AttributeType.Boolean,
        },
        {
          label: "Type of event",
          type: AttributeType.Enum,
          enumSet: [
            "Participants are predominantly seated or standing in a fixed position during the session.",
            "Participants are predominantly non-seated and moving about during the session.",
          ],
        },
        {
          label: "Number of participants",
          type: AttributeType.Number,
        },
      ],
    },
  ],
  ruleSets: [miceRuleset, dineInRuleSetNew as RuleSet],
});
