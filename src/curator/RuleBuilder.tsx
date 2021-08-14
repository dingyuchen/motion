import { createContext } from "preact";
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
  LogicalFunc,
  ModelFunc,
  NumberFunc,
  OptionalFunc,
} from "../../motion-bee/lib/types";
import { RuleStoreContext } from "../app";
import { RuleStore, StoreHandler } from "../shared/RuleStore";
import { AttributeDefinition, blankExpression, blankRule, Rule, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";

const RuleContext = createContext(blankRule());

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
    <div className="card border-2 w-11/12 px-4 py-4 mt-4">
      <h1 className="font-semibold text-xl">Rule {index + 1}</h1>
      <div className="flex">
        <h2 className="text-lg font-semibold">involving the schema:</h2>
        <select onChange={updateInputSchema} value={rule.input.name} className="font-semibold ml-2">
          {schemata.map((schema) => (
            <option value={schema.name}>{schema.name}</option>
          ))}
        </select>
      </div>
      <RuleContext.Provider value={rule}>
        <JunctionExpressionBuilder rule={rule} exprUpdateHandler={expressionUpdateHandler} />
      </RuleContext.Provider>
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

  const addSubJunction = () => {
    if (isExpr(expr)) {
      const args = expr.args as Expression[];
      const defaultExpression = expressionFromSource(ruleStore, input);
      const subJunction = { args: [defaultExpression], op: LogicalFunc.And };
      exprUpdateHandler({ ...expr, args: args.concat(subJunction) });
    }
  };

  // TODO: add button to interact
  const negate = () => {
    exprUpdateHandler({ op: LogicalFunc.Not, args: [expr] });
  };

  const options = [LogicalFunc.And, LogicalFunc.Or];
  return (
    <div className="p-2 mt-2">
      {expr.args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={op} className="text-3xl font-semibold">
          {options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      )}
      <span className="ml-4 font-semibold text-lg">{op === LogicalFunc.And ? "All of the following:" : "At least one of the following:"}</span>
      <div>{expr.args.map((subExp, index) => renderExpEditor(subExp as Expr, onSubExpressionUpdate(index)))}</div>
      <button onClick={addJunction} className="btn-primary text-md font-semibold mt-4">New condition</button>
      <button onClick={addSubJunction} className="btn-primary text-md font-semibold mt-4 ml-2">New logical group</button>
    </div>
  );
};

const LogicalExpBuilder = ({ expr, exprUpdateHandler }: { expr: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const ruleStore = useContext(RuleStoreContext);
  const rule = useContext(RuleContext);
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
      const defaultExpression = expressionFromSource(ruleStore, rule.input);
      exprUpdateHandler({ ...expr, args: args.concat(defaultExpression) });
    }
  };

  const addSubJunction = () => {
    if (isExpr(expr)) {
      const args = expr.args as Expression[];
      const defaultExpression = expressionFromSource(ruleStore, rule.input);
      const subJunction = { args: [defaultExpression], op: LogicalFunc.And };
      exprUpdateHandler({ ...expr, args: args.concat(subJunction) });
    }
  };

  // TODO: add button to interact
  const negate = () => {
    exprUpdateHandler({ op: LogicalFunc.Not, args: [expr] });
  };

  const options = [LogicalFunc.And, LogicalFunc.Or];
  return (
    <div className="card border-2 p-2 mt-2">
      {expr.args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={op} className="text-xl font-semibold">
          {options.map((option) => (
            <option value={op}>{option}</option>
          ))}
        </select>
      )}
      {expr.args.map((subExp, index) => (
        <div id="test-sep" class="mt-2">
          {renderExpEditor(subExp as Expr, onSubExpressionUpdate(index))}
        </div>
      ))}
      <button onClick={addJunction} className="btn-primary text-sm font-normal mt-4">New condition</button>
      <button onClick={addSubJunction} className="btn-primary text-sm font-normal mt-4 ml-2">New logic group</button>
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
    case CollectionFunc.Size:
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
    case LogicalFunc.And:
    case LogicalFunc.Or:
      return <LogicalExpBuilder expr={e} exprUpdateHandler={exprUpdateHandler} />;
    default:
      return <div class="border-2">{JSON.stringify(e)}</div>;
  }
};

const OptionalExpEditor = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  return <div>Optional operations</div>;
};

const LookUpExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const rule = useContext(RuleContext);
  const options = rule.input.attributes.map((attr) => attr.label);
  const selectedAttr = exp.args[0] as string;
  const ruleStore = useContext(RuleStoreContext);

  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const attrLabel = e.currentTarget.value;
      const newAttr = rule.input.attributes.find((attr) => attr.label === attrLabel);
      const newLookup = { ...exp, args: [attrLabel] };
      const newExp = expressionForType(ruleStore, newAttr!, newLookup);
      exprUpdateHandler(newExp);
    }
  };
  return (
    <select onChange={opUpdateHandler} value={selectedAttr}>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
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
    // if the input has changed, new expr should be passed up to the root
    exprUpdateHandler(e);
  };
  const onRightSubExpUpdate = (e: Expr) => {
    const newArgs = [e, args[1]];
    exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
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
      {!!right && renderExpEditor(right as Expr, onRightSubExpUpdate)}
    </>
  );
};

const DateExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const options = [DateFunc.IsAfter, DateFunc.IsBefore, DateFunc.IsBetween];
  const { args, op } = exp;
  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const newOp = e.currentTarget.value as FuncType;
      exprUpdateHandler({ ...exp, op: newOp });
    }
  };
  const onLeftSubExpUpdate = (e: Expr) => {
    exprUpdateHandler(e);
  };
  const onRightSubExpUpdate = (e: Event) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      const rhs = JSON.parse(e.currentTarget.value);
      const newArgs = [args[0], rhs];
      exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
    }
  };
  const onFurtherRightExpUpdate = (e: Event) => {
    if (op === DateFunc.IsBetween && e.currentTarget instanceof HTMLInputElement) {
      const rrhs = JSON.parse(e.currentTarget.value);
      const newArgs = [args[0], args[1], rrhs];
      exprUpdateHandler({ ...exp, args: newArgs as Expression[] });
    }
  };
  const [left, right, moreRight] = args;
  return (
    <>
      {renderExpEditor(left as Expr, onLeftSubExpUpdate)}
      <select onChange={opUpdateHandler} value={op}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      {/* // TODO: proper input field */}
      <input type="date" name="Date" onInput={onRightSubExpUpdate} value={right as string} />
      {op === DateFunc.IsBetween && (
        <>
          And
          <input type="date" name="Date" onInput={onFurtherRightExpUpdate} value={moreRight as string} />
        </>
      )}
    </>
  );
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
    exprUpdateHandler(e);
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
  const options = [EnumFunc.Is, EnumFunc.IsNot];
  const attrSpace = useContext(RuleContext).input.attributes; // TODO: lookup return value of subexpression
  const { args, op } = exp;
  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const newOp = e.currentTarget.value as FuncType;
      exprUpdateHandler({ ...exp, op: newOp });
    }
  };
  const onLeftSubExpUpdate = (e: Expr) => {
    exprUpdateHandler(e);
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
    <div>
      {renderExpEditor(left as Expr, onLeftSubExpUpdate)}
      <select onChange={opUpdateHandler} value={op}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      <select onChange={onRightSubExpUpdate} value={right as string}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const BoolExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const options = [BooleanFunc.IsChecked, BooleanFunc.IsNotChecked];
  const { args, op } = exp;
  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const newOp = e.currentTarget.value as FuncType;
      exprUpdateHandler({ ...exp, op: newOp });
    }
  };
  const onLeftSubExpUpdate = (e: Expr) => {
    exprUpdateHandler(e);
  };

  const [param] = args;
  return (
    <div className="mt-2">
      {renderExpEditor(param as Expr, onLeftSubExpUpdate)}
      <select onChange={opUpdateHandler} value={op}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const isExpr = (e: Expression): e is Expr => {
  return typeof e === "object";
};
