import { AttributeType, Expression } from "../../motion-bee/lib/types";

export interface Schema {
  name: string;
  attributes: AttributeDefinition[];
}

export interface AttributeDefinition {
  label: string;
  type: AttributeType;
  subtype?: string;
}

export interface RuleSet {
  title: string;
  rules: Rule[];
}

export interface Rule {
  expr: Expression;
  input: Schema;
}
