import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Attribute, AttributeType, Expr, Expression, LogicalFunc, ModelFunc, Value } from "../../motion-bee/lib/types";
import { AttributeDefinition, Rule, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";
import { junction } from "./expressionHelper";

export const RuleBuilder = ({
  rule,
  index,
  schemata,
  ruleUpdateHandler,
}: {
  rule: Rule;
  index: number;
  schemata: Schema[];
  ruleUpdateHandler: (_: Rule) => void;
}) => {
  // index for displaying
  const updateInputSchema = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const schemaName = e.currentTarget.value;
      const input = schemata.filter((schema) => schema.name === schemaName)[0];
      ruleUpdateHandler({ ...rule, input });
    }
  };
  const expressionUpdateHandler = (expr: Expression) => {
    ruleUpdateHandler({ ...rule, expr });
  };

  return (
    <div>
      <h1>{index + 1}</h1>
      Model selection
      <select onChange={updateInputSchema}>
        {schemata.map((schema) => (
          <option>{schema.name}</option>
        ))}
      </select>
      <JunctionExpressionBuilder rule={rule} exprUpdateHandler={expressionUpdateHandler} />
    </div>
  );
};

const JunctionExpressionBuilder = ({
  rule, // to reference input model
  exprUpdateHandler,
}: {
  rule: Rule;
  exprUpdateHandler: (_: Expression) => void;
}) => {
  const [junctionOperation, setJunctionOperation] = useState(LogicalFunc.And);
  const { expr, input } = rule;
  const junctionUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const junction = e.currentTarget.value;
      setJunctionOperation(junction as LogicalFunc);
    }
  };
  const onSubExpressionUpdate = (index: number) => (exp: Expression) => {
    if (isExpr(expr)) {
      const newExprs = immutableReplace(expr.args as Expression[], index, exp);
      exprUpdateHandler(junction(junctionOperation, newExprs));
    }
  };

  const options = [LogicalFunc.And, LogicalFunc.Or];
  return (
    <div>
      <select onChange={junctionUpdateHandler} value={junctionOperation}>
        {options.map((opt) => (
          <option>{opt}</option>
        ))}
      </select>
      {(expr as Expr).args.map((subExp, index) => (
        <SchemaLookUpBuilder exprUpdateHandler={onSubExpressionUpdate(index)} schema={input} />
      ))}
    </div>
  );
};

const SchemaLookUpBuilder = ({
  exprUpdateHandler,
  schema,
}: {
  exprUpdateHandler: (_: Expression) => void;
  schema: Schema;
}) => {
  const [workingAttr, setWorkingAttr] = useState(schema.attributes[0]);
  const onSelectAttribute = ({ currentTarget }: { currentTarget: EventTarget }) => {
    if (currentTarget instanceof HTMLSelectElement) {
      const attr = schema.attributes.filter((attr) => attr.label === currentTarget.value)[0];
      setWorkingAttr(attr);
    }
  };
  const nextExpUpdateHandler = (e: Expr) => {
    const { args } = e;
    const self: Expr = { args: [workingAttr.label], op: ModelFunc.Lookup };
    const newExpr = { ...e, args: [self, ...args] };
    exprUpdateHandler(newExpr as Expr);
  };
  const furtherLookUpHandler = (e: Expression) => {
    const self: Expr = { args: [workingAttr.label, e], op: ModelFunc.Lookup };
    exprUpdateHandler(self);
  };
  return (
    <div>
      <select name="attribute" onChange={onSelectAttribute} value={workingAttr.label}>
        {schema.attributes.map((attr) => (
          <option value={attr.label}>{attr.label}</option>
        ))}
      </select>
      {renderContinuation(workingAttr, nextExpUpdateHandler, furtherLookUpHandler)}
    </div>
  );
};

const renderContinuation = (
  attribute: AttributeDefinition,
  nextExpUpdateHandler: (_: Expr) => void,
  furtherLookUpHandler: (_: Expression) => void
) => {
  switch (attribute.type) {
    case AttributeType.Model:
      return;
    default:
      break;
  }
};

const isExpr = (e: Expression): e is Expr => {
  return typeof e === "object";
};
