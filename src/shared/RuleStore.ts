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

  // getSchema = (schemaName: string) => {
  //   const res = this.ruleStore.schemata.filter(
  //     (schema) => schema.name === schemaName
  //   );
  //   if (res.length < 1) {
  //     throw new Error("schema not in rulestore");
  //   }
  //   return res[0];
  // };

  get getSchemata() {
    return this.ruleStore.schemata;
  }

  get getRuleSets() {
    return this.ruleStore.ruleSets;
  }
}

export const blankRuleStore = (): RuleStore => ({ schemata: [], ruleSets: [] });
