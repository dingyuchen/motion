import { AttributeType } from "../../motion-bee/lib/types";
import { RuleSet, Schema } from "./types";

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
import { miceRuleset, dineInRuleset } from "./schemaHelper";
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
  ruleSets: [dineInRuleset, miceRuleset],
});
