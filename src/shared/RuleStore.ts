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

  addSchema = (schema: Schema) => {
    const schemata = this.ruleStore.schemata.concat(schema);
    this.setFn({ ...this.ruleStore, schemata });
  };
}

export const blankRuleStore = (): RuleStore => ({ schemata: [], ruleSets: [] });
