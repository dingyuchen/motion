import { useContext, useEffect, useState } from "preact/hooks";
import {
  Attribute,
  AttributeType,
  BooleanFunc,
  CollectionFunc,
  DateFunc,
  Expr,
  Expression,
  LogicalFunc,
  ModelFunc,
  NumberFunc,
  OptionalFunc,
} from "../../motion-bee/lib/types";
import { RuleStoreContext } from "../app";
import { RuleStore, StoreHandler } from "../shared/RuleStore";
import { AttributeDefinition, blankExpression, Rule, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";

export const RuleBuilder = ({
  rule,
  index, // index for displaying
  ruleUpdateHandler,
}: {
  rule: Rule;
  index: number;
  ruleUpdateHandler: (_: Rule) => void;
}) => {
  const ruleStore = useContext(RuleStoreContext);
  const schemata = ruleStore.getSchemata;
  const updateInputSchema = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const schemaName = e.currentTarget.value;
      const input = ruleStore.getSchema(schemaName);
      ruleUpdateHandler({ ...rule, input });
    }
  };
  const expressionUpdateHandler = (expr: Expression) => {
    ruleUpdateHandler({ ...rule, expr });
  };

  return (
    <div className="card border-2 w-11/12">
      <h1>{index + 1}</h1>
      Model selection
      <select onChange={updateInputSchema} value={rule.input.name}>
        {schemata.map((schema) => (
          <option value={schema.name}>{schema.name}</option>
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
  const ruleStore = useContext(RuleStoreContext);
  const { input } = rule;
  const expr = rule.expr as Expr;
  const { op } = expr;

  const junctionUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const junction = e.currentTarget.value as LogicalFunc;
      exprUpdateHandler({ ...expr, op: junction });
    }
  };
  const onSubExpressionUpdate = (index: number) => (exp: Expression) => {
    if (isExpr(expr)) {
      const newExprs = immutableReplace(expr.args as Expression[], index, exp);
      exprUpdateHandler({ ...expr, args: newExprs });
    }
  };

  const addJunction = () => {
    if (isExpr(expr)) {
      const args = expr.args as Expression[];
      const defaultExpression = expressionFromSource(ruleStore, input);
      exprUpdateHandler({ ...expr, args: args.concat(defaultExpression) });
    }
  };

  const options = [LogicalFunc.And, LogicalFunc.Or];
  return (
    <div>
      {(expr as Expr).args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={op}>
          {options.map((option) => (
            <option value={op}>{option}</option>
          ))}
        </select>
      )}
      {(expr as Expr).args.map((subExp, index) => renderContinuation(subExp as Expr, onSubExpressionUpdate(index)))}
      <button onClick={addJunction}>More</button>
    </div>
  );
};

const expressionFromSource = (ruleStore: StoreHandler, input: Schema): Expr => {
  const defAttribute = input.attributes[0]; // TODO: do not allow schema with no attributes
  const { label } = defAttribute;
  const defaultLookUpExp: Expr = { args: [label], op: ModelFunc.Lookup };
  const defaultExpression = expressionForType(ruleStore, defAttribute, defaultLookUpExp);
  return defaultExpression;
};

const expressionForType = (ruleStore: StoreHandler, attr: AttributeDefinition, arg: Expression): Expr => {
  switch (attr.type) {
    case AttributeType.Model:
      const submodel = ruleStore.getSchema(attr.subtype!);
      const defAttribute = submodel.attributes[0];
      const { label } = defAttribute;
      const lookup = { args: [label, arg], op: ModelFunc.Lookup };
      return expressionForType(ruleStore, defAttribute, lookup);
    case AttributeType.Collection:
      return (() => {
        const submodel = ruleStore.getSchema(attr.subtype!);
        return { args: [arg, expressionFromSource(ruleStore, submodel)], op: CollectionFunc.AnyOf };
      })();
    case AttributeType.Date:
      return { args: [arg, Date.now()], op: DateFunc.IsAfter };
    case AttributeType.Number:
      return { args: [arg, 0], op: NumberFunc.Equal };
    case AttributeType.Enum:
      return { args: [arg, attr.enumSet![0]], op: NumberFunc.Equal };
    case AttributeType.Boolean:
      return { args: [arg], op: BooleanFunc.IsChecked };
    case AttributeType.Optional:
      return { args: [arg], op: OptionalFunc.Exists };
    default:
      return blankExpression();
  }
};

const renderContinuation = (e: Expr, nextExpUpdateHandler: (_: Expr) => void) => {
  switch (e.op) {
    default:
      return <div>{JSON.stringify(e)}</div>;
  }
};

const CollectionExpBuilder = ({ exprUpdateHandler }: { exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Collection operations</div>;
};

const DateExpBuilder = ({ exprUpdateHandler }: { exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Date operations</div>;
};

const NumberExpBuilder = ({ exprUpdateHandler }: { exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Number operations</div>;
};

const EnumExpBuilder = ({ exprUpdateHandler }: { exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Enum operations</div>;
};

const NegationExpBuilder = ({ exprUpdateHandler }: { exprUpdateHandler: (_: Expr) => void }) => {
  return <div>boolean operations</div>;
};

const isExpr = (e: Expression): e is Expr => {
  return typeof e === "object";
};
