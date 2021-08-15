import { useState } from "preact/hooks";

import { Attribute, AttributeType, LogicalFunc, Model, Value } from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";
import { AttributeDefinition, RuleSet, Schema } from "../shared/types";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";
import { StoreHandler } from "../shared/RuleStore";
import { evaluator } from "../../motion-bee/lib/eval";

interface ModelSchemaPair {
  model: Model;
  schema: Schema;
}

export function ConsumerEdit({
  ruleset,
  handleBack,
  store,
}: {
  ruleset: RuleSet;
  handleBack: () => void;
  store: StoreHandler;
}) {
  const schemataNames: string[] = ruleset.rules.map((rule) => rule.input.name);
  const uniqueSchemata: Schema[] = Array.from(new Set(schemataNames)).map((key) => store.getSchema(key));

  const initialPairs: ModelSchemaPair[] = uniqueSchemata.map((schema) => {
    return { model: modelFromSchema(schema), schema: schema };
  });

  const [pairs, setPairs] = useState(initialPairs);
  const [outcomes, setOutcomes] = useState<Value[]>([]);
  const handleChange = (newModel: Model, index: number) => {
    const newPairs = [...pairs];
    newPairs[index] = { model: newModel, schema: newPairs[index].schema };
    setPairs(newPairs);
  };

  const handleSubmit = () => {
    const rules = ruleset.rules;
    const outcomes: Value[] = [];
    for (const rule of rules) {
      const schema = rule.input;
      const model = pairs.find((pair) => pair.model.label === schema.name)!.model;
      console.log(model);
      outcomes.push(evaluator(rule.expr, model));
    }
    setOutcomes(outcomes);
  };

  return (
    <>
      <div className="mt-16">
        <div className="flex w-11/12">
          <button className="btn-danger px-4 text-md flex" onClick={handleBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </button>
          <div className="flex-1"></div>
          <button onClick={handleSubmit} className="submit btn-good">
            Evaluate
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mb-4">CONSUMER VIEW</h1>
        {pairs.map((pair, index) => (
          <ModelCard
            model={pair.model}
            onChange={(newModel) => handleChange(newModel, index)}
            schema={pair.schema}
            store={store}
          />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <button onClick={handleSubmit} className="submit btn-good">
          Evaluate
        </button>
      </div>
      <div className="mt-12 flex justify-center">
        {outcomes.length > 0 ? (
          !!outcomes.find((o) => o) ? (
            <span className="text-green-600 font-semibold">PERMITTED</span>
          ) : (
            <span className="text-red-600 font-semibold">NOT PERMITTED</span>
          )
        ) : (
          <span></span>
        )}
      </div>
    </>
  );
}
