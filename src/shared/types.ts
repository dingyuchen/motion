import { AttributeType, Expression } from "../../motion-bee/lib/types";

export interface Schema {
  name: string;
  attributes: AttributeDefinition[];
}

export const blankSchema = (): Schema => ({ name: "", attributes: [] });

export interface AttributeDefinition {
  label: string;
  type: AttributeType | string;
  subtype?: AttributeType | string;
  enumSet?: string[];
}

export const defaultNewAttrDef = (): AttributeDefinition => ({
  label: "",
  type: AttributeType.Boolean,
});

export interface RuleSet {
  title: string;
  rules: Rule[];
}

export interface Rule {
  expr: Expression;
  input: Schema; // corresponding schema for a rule
}
