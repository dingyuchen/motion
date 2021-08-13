import { render } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Attribute, AttributeType, Expr, Expression, LogicalFunc, ModelFunc, Value } from "../../motion-bee/lib/types";
import { RuleStoreContext } from "../app";
import { AttributeDefinition, blankExpression, Rule, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";

export const RuleBuilder = ({
  rule,
  index,
  ruleUpdateHandler,
}: {
  rule: Rule;
  index: number;
  ruleUpdateHandler: (_: Rule) => void;
}) => {
  // index for displaying
  const schemata = useContext(RuleStoreContext).getSchemata;
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
      exprUpdateHandler({ op: junctionOperation, args: newExprs });
    }
  };

  const addJunction = () => {
    if (isExpr(expr)) {
      const args = expr.args as Expression[];
      const label = input.attributes[0].label;
      const defaultLookUpExp: Expr = { args: [label], op: ModelFunc.Lookup };
      exprUpdateHandler({ op: junctionOperation, args: args.concat(defaultLookUpExp) });
    }
  };

  const options = [LogicalFunc.And, LogicalFunc.Or];
  return (
    <div>
      {(expr as Expr).args.length < 2 && (
        <select onChange={junctionUpdateHandler} value={junctionOperation}>
          {options.map((opt) => (
            <option>{opt}</option>
          ))}
        </select>
      )}
      {(expr as Expr).args.map((subExp, index) => (
        <SchemaLookUpBuilder exprUpdateHandler={onSubExpressionUpdate(index)} schema={input} />
      ))}
      <button onClick={addJunction}>More</button>
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
  const schemaSpace = useContext(RuleStoreContext).getSchemata;
  switch (attribute.type) {
    case AttributeType.Model:
      const schema = schemaSpace.filter((s) => s.name === attribute.subtype)[0];
      return <SchemaLookUpBuilder exprUpdateHandler={furtherLookUpHandler} schema={schema} />;
    case AttributeType.Collection:
      return <CollectionExpBuilder exprUpdateHandler={nextExpUpdateHandler} />;
    default:
      break;
  }
};

const CollectionExpBuilder = ({ exprUpdateHandler }: { exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Collection operations</div>;
};

const isExpr = (e: Expression): e is Expr => {
  return typeof e === "object";
};
