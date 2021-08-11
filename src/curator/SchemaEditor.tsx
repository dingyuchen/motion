import { useState } from "preact/hooks";
import { StoreHandler } from "../shared/RuleStore";
import { blankSchema, Schema } from "../shared/types";
import { SchemaBuilder } from "./SchemaBuilder";

export const SchemaEditor = ({ store }: { store: StoreHandler }) => {
  const [selectedSchema, setSelectedSchema] = useState(blankSchema());
  const [openEditor, setOpenEditor] = useState(false);
  const updateFn = (schema: Schema) => {
    store.addSchema(schema);
    setOpenEditor(false);
  };
  return (
    <>
      <div>Schema editor</div>
      <div>All models:</div>
      {Object.values(store.ruleStore.schemata).map((schema) => (
        <div onClick={() => setSelectedSchema(store.getSchema(schema.name))}>
          {JSON.stringify(schema)}
        </div>
      ))}
      <button onClick={() => setOpenEditor(true)}>Add new Schema</button>
      {openEditor && (
        <SchemaBuilder schema={selectedSchema} updateHandler={updateFn} />
      )}
    </>
  );
};
