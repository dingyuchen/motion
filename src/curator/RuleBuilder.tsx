import { createContext, JSX } from "preact";
import { useContext } from "preact/hooks";
import {
  AttributeType,
  BooleanFunc,
  CollectionFunc,
  DateFunc,
  EnumFunc,
  Expr,
  Expression,
  FuncType,
  LogicalFunc,
  Model,
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
      // const defaultExpr = expressionFromSource(ruleStore, input);
      // const juncWrapped = { ...blankExpression(), args: [defaultExpr] };
      ruleUpdateHandler({ input, expr: blankExpression() });
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
  exprUpdateHandler: (_: Expr) => void;
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
      <span className="ml-4 font-semibold text-lg">
        {op === LogicalFunc.And ? "All of the following:" : "At least one of the following:"}
      </span>
      <div>{expr.args.map((subExp, index) => renderExpEditor(subExp as Expr, onSubExpressionUpdate(index)))}</div>
      <button onClick={addJunction} className="btn-primary text-md font-semibold mt-4">
        New condition
      </button>
      <button onClick={addSubJunction} className="btn-primary text-md font-semibold mt-4 ml-2">
        New logic group
      </button>
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
    <div className="card border-2 border-gray-300 p-2 mt-2">
      {expr.args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={op} className="text-xl font-semibold">
          {options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      )}
      {expr.args.map((subExp, index) => (
        <div id="test-sep" class="mt-2">
          {renderExpEditor(subExp as Expr, onSubExpressionUpdate(index))}
        </div>
      ))}
      <button onClick={addJunction} className="btn-primary text-sm font-normal mt-4">
        New condition
      </button>
      <button onClick={addSubJunction} className="btn-primary text-sm font-normal mt-4 ml-2">
        New logic group
      </button>
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
    case AttributeType.Enum:
      return { args: [arg, attr.enumSet![0]], op: EnumFunc.Is };
    default:
      return simpleExpressionForType(attr.type, arg);
  }
};

const simpleExpressionForType = (type: AttributeType, arg: Expression): Expr => {
  switch (type) {
    case AttributeType.Date:
      return { args: [arg, Date.now()], op: DateFunc.IsAfter };
    case AttributeType.Number:
      return { args: [arg, 0], op: NumberFunc.Equal };
    case AttributeType.Boolean:
      return { args: [arg], op: BooleanFunc.IsChecked };
    case AttributeType.Optional:
      return { args: [arg], op: OptionalFunc.Exists };
    default:
      return blankExpression();
  }
};

const renderExpEditor = (e: Expr, exprUpdateHandler: (_: Expr) => void): JSX.Element => {
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
  const options = [
    CollectionFunc.AllOf,
    CollectionFunc.AnyOf,
    CollectionFunc.NoneOf,
    CollectionFunc.NumberOf,
    CollectionFunc.Size,
  ];
  const { args, op } = exp;
  const [left, right] = args;
  const opUpdateHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLSelectElement) {
      const newOp = e.currentTarget.value as FuncType;
      if (newOp === CollectionFunc.Size) {
        // if op is Size, lhs should be still be a collection, other args disposed
        const newArgs = [args[0]] as Expression[];
        const overall = simpleExpressionForType(AttributeType.Number, { args: newArgs, op: newOp });
        return exprUpdateHandler(overall);
      } else if (newOp === CollectionFunc.NumberOf) {
        const overall = simpleExpressionForType(AttributeType.Number, { ...exp, op: newOp });
        return exprUpdateHandler(overall);
      }
      exprUpdateHandler({ ...exp, op: newOp });
    }
  };
  const onLeftSubExpUpdate = (e: Expr) => {
    // if the input has changed, new expr should be passed up to the root
    exprUpdateHandler(e);
  };
  const onRightSubExpUpdate = (e: Expr) => {
    const newArgs = [args[0], e] as Expression[];
    exprUpdateHandler({ ...exp, args: newArgs });
  };

  const attrSpace = useContext(RuleContext).input.attributes;
  const ruleStore = useContext(RuleStoreContext);
  const getSubExpBuilder = (e: Expr) => {
    // WARN Naive non-recursive lookup, to revise if able
    const lookupExp = exp.args[0] as Expr;
    const groupAttrLabel = lookupExp.args[0];
    const subSchemaName = attrSpace.find((attr) => attr.label === groupAttrLabel)!.subtype!;
    const subSchema = ruleStore.getSchema(subSchemaName);
    const ctx = { ...blankRule(), input: subSchema };
    // TODO: discuss if rhs SHOULD BE a boolean operation (easier to reuse components + customizability)
    // FIXME: display subschema in subrenderer (object cannot be child error)
    return (
      <RuleContext.Provider value={ctx}>
        <CollectionSubExpBuilder exprUpdateHandler={onRightSubExpUpdate} exp={e} />
        {/* {renderExpEditor(e, exprUpdateHandler)} */}
      </RuleContext.Provider>
    );
  };
  return (
    <div className="mt-4">
      {renderExpEditor(left as Expr, onLeftSubExpUpdate)}
      <select onChange={opUpdateHandler} value={op}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      {isExpr(right as Expr) && getSubExpBuilder(right as Expr)}
    </div>
  );
};

const CollectionSubExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const rule = useContext(RuleContext);
  return (
    <>
      {rule.input.name}
      {renderExpEditor(exp, exprUpdateHandler)}
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
          <option value={option}>{toPlainEnglish(option)}</option>
        ))}
      </select>
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
          <option value={option}>{toPlainEnglish(option)}</option>
        ))}
      </select>
      <input type="number" name="Number" onInput={onRightSubExpUpdate} value={right as string} />
    </>
  );
};

const EnumExpBuilder = ({ exprUpdateHandler, exp }: { exp: Expr; exprUpdateHandler: (_: Expr) => void }) => {
  const options = [EnumFunc.Is, EnumFunc.IsNot];
  const attrSpace = useContext(RuleContext).input.attributes;

  // Naive non-recursive lookup, to revise if able
  const exprModel = exp.args[0] as Expr;
  const exprAttributeName = exprModel.args[0];
  const enumSpace = attrSpace.find((attr) => attr.label === exprAttributeName)!.enumSet!;

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
    if (e.currentTarget instanceof HTMLSelectElement) {
      const rhs = e.currentTarget.value;
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
          <option value={option}>{toPlainEnglish(option)}</option>
        ))}
      </select>
      <select onChange={onRightSubExpUpdate} value={right as string}>
        {enumSpace.map((option) => (
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
          <option value={option}>{toPlainEnglish(option)}</option>
        ))}
      </select>
    </div>
  );
};

const isExpr = (e: Expression): e is Expr => {
  return typeof e === "object" && "op" in e;
};

const toPlainEnglish = (option: FuncType) => {
  switch (option) {
    case ModelFunc.Lookup:
    case NumberFunc.Equal:
      return "Equals";
    case NumberFunc.LessThan:
      return "Is less than";
    case NumberFunc.LessThanOrEqual:
      return "Is less than or equal to";
    case NumberFunc.MoreThan:
      return "Is more than";
    case NumberFunc.MoreThanOrEqual:
      return "Is more than or equal to";
    case CollectionFunc.AllOf:
    case CollectionFunc.AnyOf:
    case CollectionFunc.NoneOf:
    case CollectionFunc.NumberOf:
    case CollectionFunc.Size:
      return "Size";
    case DateFunc.IsAfter:
      return "Is after";
    case DateFunc.IsBefore:
      return "Is before";
    case DateFunc.IsBetween:
      return "Is between";
    case EnumFunc.Is:
      return "Is";
    case EnumFunc.IsNot:
      return "Is not";
    case BooleanFunc.IsChecked:
      return "Is true";
    case BooleanFunc.IsNotChecked:
      return "Is not true";
    case OptionalFunc.Exists:
      return "Exists";
    case OptionalFunc.ExistsAnd:
      return "Exists and";
    default:
      return option;
  }
};
