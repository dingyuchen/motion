import { useContext, useEffect, useState } from "preact/hooks";
import {
  Attribute,
  AttributeType,
  BooleanFunc,
  CollectionFunc,
  DateFunc,
  EnumFunc,
  Expr,
  Expression,
  FuncType,
  IdentityFunc,
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
      {expr.args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={op}>
          {options.map((option) => (
            <option value={op}>{option}</option>
          ))}
        </select>
      )}
      {expr.args.map((subExp, index) => renderExpEditor(subExp as Expr, onSubExpressionUpdate(index)))}
      <button onClick={addJunction}>More</button>
    </div>
  );
};

const LogicalExpBuilder = ({
  input, // to reference input model
  expr,
  exprUpdateHandler,
}: {
  input: Schema;
  expr: Expr;
  exprUpdateHandler: (_: Expression) => void;
}) => {
  const ruleStore = useContext(RuleStoreContext);
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
      {expr.args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={op}>
          {options.map((option) => (
            <option value={op}>{option}</option>
          ))}
        </select>
      )}
      {expr.args.map((subExp, index) => renderExpEditor(subExp as Expr, onSubExpressionUpdate(index)))}
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

const renderExpEditor = (e: Expr, exprUpdateHandler: (_: Expr) => void) => {
  switch (e.op) {
    case ModelFunc.Lookup:
      return <LookUpExpBuilder exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case NumberFunc.Equal:
    case NumberFunc.LessThan:
    case NumberFunc.LessThanOrEqual:
    case NumberFunc.MoreThan:
    case NumberFunc.MoreThanOrEqual:
      return <NumberExpBuilder exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case CollectionFunc.AllOf:
    case CollectionFunc.AnyOf:
    case CollectionFunc.NoneOf:
    case CollectionFunc.NumberOf:
      return <CollectionExpBuilder exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case DateFunc.IsAfter:
    case DateFunc.IsBefore:
    case DateFunc.IsBetween:
      return <DateExpBuilder exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case EnumFunc.Is:
    case EnumFunc.IsNot:
      return <EnumExpBuilder exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case BooleanFunc.IsChecked:
    case BooleanFunc.IsNotChecked:
      return <BoolExpBuilder exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case OptionalFunc.Exists:
    case OptionalFunc.ExistsAnd:
      return <OptionalExpEditor exp={e} exprUpdateHandler={exprUpdateHandler} />;
    case IdentityFunc.Lambda: // deprecated
    default:
      return <div class="border-2">{JSON.stringify(e)}</div>;
  }
};

const OptionalExpEditor = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Optional operations</div>;
};

const LookUpExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Model operations</div>;
};

const CollectionExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const options = [CollectionFunc.AllOf, CollectionFunc.AnyOf, CollectionFunc.NoneOf, CollectionFunc.NumberOf];
  const { args, op } = exp;
  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const newOp = e.currentTarget.value as FuncType;
      if (newOp !== op) {
        // TODO: generate new expression
        if (newOp === CollectionFunc.NumberOf) {
          //
        } else {
          //
        }
      }
      exprUpdateHandler({ ...exp, op: newOp });
    }
  };
  const onLeftSubExpUpdate = (e: Expr) => {
    const newArgs = [args[0], e];
    exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
  };
  const onRightSubExpUpdate = (e: Expr) => {
    const newArgs = [e, args[1]];
    exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
  };
  const [left, right] = args;
  console.log(right);
  return (
    <>
      {renderExpEditor(left as Expr, onLeftSubExpUpdate)}
      <select onChange={opUpdateHandler} value={op}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      {/* // TODO: proper input field */}
      {renderExpEditor(right as Expr, onRightSubExpUpdate)}
    </>
  );
};

const DateExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Date operations</div>;
};

const NumberExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const options = [
    NumberFunc.Equal,
    NumberFunc.LessThan,
    NumberFunc.LessThanOrEqual,
    NumberFunc.MoreThan,
    NumberFunc.MoreThanOrEqual,
  ];
  const { args, op } = exp;
  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const newOp = e.currentTarget.value as FuncType;
      exprUpdateHandler({ ...exp, op: newOp });
    }
  };
  const onLeftSubExpUpdate = (e: Expr) => {
    const newArgs = [e, args[1]];
    exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
  };
  const onRightSubExpUpdate = (e: Event) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      const rhs = JSON.parse(e.currentTarget.value);
      const newArgs = [args[0], rhs];
      exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
    }
  };
  const [left, right] = args;
  return (
    <>
      {renderExpEditor(left as Expr, onLeftSubExpUpdate)}
      <select onChange={opUpdateHandler} value={op}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      {/* // TODO: proper input field */}
      <input type="number" name="Number" onInput={onRightSubExpUpdate} value={right as string} />
    </>
  );
};

const EnumExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Enum operations</div>;
};

const BoolExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  return <div>boolean operations</div>;
};

const isExpr = (e: Expression): e is Expr => {
  return typeof e === "object";
};
