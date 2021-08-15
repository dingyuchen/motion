import { AttributeType } from "../../motion-bee/lib/types";
import { RuleSet, Schema } from "./types";
import { miceRuleset, dineInRuleset } from "./schemaHelper";

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
        name: "Dine-In",
        attributes: [
          { label: "F&B Establishment ", type: 3 },
          { label: "Number Of Person", type: 1 },
          { label: "Adult Fully Vaccinated", type: 3 },
          { label: "Children Same Household", type: 3 },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Date", type: 0 },
        ],
      },
      expr: {
        args: [
          { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Hawker Centre"], op: "Is" },
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 5], op: "LessThanOrEqual" },
          { args: [{ args: ["Adult Fully Vaccinated"], op: "Lookup" }], op: "IsChecked" },
          { args: [{ args: ["Children Same Household"], op: "Lookup" }], op: "IsChecked" },
          { args: [{ args: ["Date"], op: "Lookup" }, 1628995954748], op: "IsAfter" },
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
          { label: "Adult Fully Vaccinated", type: 3 },
          { label: "Children Same Household", type: 3 },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Date", type: 0 },
        ],
      },
      expr: {
        args: [
          { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Hawker Centre"], op: "Is" },
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 2], op: "Equal" },
          { args: [{ args: ["Date"], op: "Lookup" }, 1628996132358], op: "IsAfter" },
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
          { label: "Adult Fully Vaccinated", type: 3 },
          { label: "Children Same Household", type: 3 },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Date", type: 0 },
        ],
      },
      expr: {
        args: [
          { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Hawker Centre"], op: "Is" },
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 2], op: "Equal" },
          { args: [{ args: ["Date"], op: "Lookup" }, 1628996165878], op: "IsAfter" },
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
          { label: "Adult Fully Vaccinated", type: 3 },
          { label: "Children Same Household", type: 3 },
          { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
          { label: "Date", type: 0 },
        ],
      },
      expr: {
        args: [
          { args: [{ args: ["Type of F&B Establishment"], op: "Lookup" }, "Hawker Centre"], op: "Is" },
          { args: [{ args: ["Number Of Person"], op: "Lookup" }, 5], op: "LessThanOrEqual" },
          { args: [{ args: ["Adult Fully Vaccinated"], op: "Lookup" }], op: "IsChecked" },
          { args: [{ args: ["Date"], op: "Lookup" }, 1628996182919], op: "IsAfter" },
        ],
        op: "And",
      },
    },
  ],
  title: "Dine In (Effective 10 August)",
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
        { label: "Adult Fully Vaccinated", type: 3 },
        { label: "Children Same Household", type: 3 },
        { label: "Type of F&B Establishment", type: 2, enumSet: ["Hawker Centre", "Coffee Shop", "Restaurant"] },
        { label: "Date", type: 0 },
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
  ruleSets: [dineInRuleset, miceRuleset, dineInRuleSetNew as RuleSet],
});
