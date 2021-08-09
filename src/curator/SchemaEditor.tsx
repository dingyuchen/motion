import { AttributeType } from "../../motion-bee/lib/types";
import { StoreHandler } from "../shared/RuleStore";
import { Schema } from "../shared/types";

export const SchemaEditor = ({ store }: { store: StoreHandler }) => {
  const schema: Schema = {
    name: "Person",
    attributes: [{ label: "age", type: AttributeType.Number }],
  };
  return (
    <>
      <div>Schema editor</div>;
      {store.ruleStore.schemata.map((schema) => (
        <div>{JSON.stringify(schema)}</div>
      ))}
      <button onClick={() => store.addSchema(schema)}>Add</button>
    </>
  );
};
