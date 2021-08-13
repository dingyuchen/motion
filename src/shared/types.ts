import {
  AttributeType,
  Expression,
  IdentityFunc,
  LogicalFunc,
} from "../../motion-bee/lib/types";

export interface Schema {
  name: string;
  attributes: AttributeDefinition[];
}

export const blankSchema = (): Schema => ({ name: "", attributes: [] });

export interface AttributeDefinition {
  label: string;
  type: AttributeType;
  subtype?: string;
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

export const blankExpression = (): Expression => ({
  args: [],
  op: LogicalFunc.And,
});

export const blankRuleSet = (): RuleSet => ({
  rules: [],
  title: "",
});

export const blankRule = (): Rule => ({
  expr: blankExpression(),
  input: blankSchema(),
});
