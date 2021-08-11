import { useEffect, useState } from "preact/hooks";
import { defaultTypes } from "../../motion-bee/lib/types";
import { StoreHandler } from "../shared/RuleStore";
import { blankSchema, Schema } from "../shared/types";
import { SchemaBuilder } from "./SchemaBuilder";

export const SchemaEditor = ({ store }: { store: StoreHandler }) => {
  const [selectedSchema, setSelectedSchema] = useState({
    index: store.getSchemata.length,
    ...blankSchema(),
  });
  const [openEditor, setOpenEditor] = useState(false);
  useEffect(() => {
    setSelectedSchema({ index: store.getSchemata.length, ...blankSchema() });
  }, [store]);
  const updateFn = (index: number) => (schema: Schema) => {
    store.editSchema(index, schema);
    setOpenEditor(false);
  };
  const editHandler = (index: number) => {
    setOpenEditor(true);
    setSelectedSchema({ index, ...store.getSchemata[index] });
  };
  const schemaSpace = [
    ...defaultTypes,
    ...store.getSchemata.map((schema) => schema.name),
  ];
  const { index } = selectedSchema;
  return (
    <>
      <div>Schema editor</div>
      <div>All models:</div>
      {store.getSchemata.map((schema, index) => (
        <div onClick={() => editHandler(index)}>{JSON.stringify(schema)}</div>
      ))}
      {!openEditor && (
        <button onClick={() => setOpenEditor(true)}>Add new Schema</button>
      )}
      {openEditor && (
        <SchemaBuilder
          schema={selectedSchema}
          schemaSpace={schemaSpace}
          updateHandler={updateFn(index)}
        />
      )}
    </>
  );
};
