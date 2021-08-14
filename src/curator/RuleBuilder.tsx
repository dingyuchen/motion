import { render } from "preact";
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
  Value,
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
    <div className="card border-2 w-11/12">
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
  const ruleStore = useContext(RuleStoreContext);
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
      const defaultExpression = expressionFromSource(ruleStore, input);
      exprUpdateHandler({ op: junctionOperation, args: args.concat(defaultExpression) });
    }
  };

  const options = [LogicalFunc.And, LogicalFunc.Or];
  return (
    <div>
      {(expr as Expr).args.length > 1 && (
        <select onChange={junctionUpdateHandler} value={junctionOperation}>
          {options.map((opt) => (
            <option>{opt}</option>
          ))}
        </select>
      )}
      {(expr as Expr).args.map((subExp, index) => renderContinuation(subExp, onSubExpressionUpdate(index)))}
      <button onClick={addJunction}>More</button>
    </div>
  );
};

const SchemaLookUpBuilder = ({
  exprUpdateHandler,
  schema,
}: {
  exprUpdateHandler: (_: Expr) => void;
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
      {renderContinuation(workingAttr, nextExpUpdateHandler)}
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
      console.log(lookup);
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
  switch (attribute.type) {
    case AttributeType.Model:
      const schema = schemaSpace.filter((s) => s.name === attribute.subtype)[0];
      return <SchemaLookUpBuilder exprUpdateHandler={nextExpUpdateHandler} schema={schema} />;
    case AttributeType.Collection:
      return <CollectionExpBuilder exprUpdateHandler={nextExpUpdateHandler} />;
    case AttributeType.Date:
      return <DateExpBuilder exprUpdateHandler={nextExpUpdateHandler} />;
    case AttributeType.Number:
      return <NumberExpBuilder exprUpdateHandler={nextExpUpdateHandler} />;
    case AttributeType.Enum:
      return <EnumExpBuilder exprUpdateHandler={nextExpUpdateHandler} />;
    case AttributeType.Boolean:
      return <NegationExpBuilder exprUpdateHandler={nextExpUpdateHandler} />;
    case AttributeType.Optional:
    // not supported currently
    default:
      break;
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
