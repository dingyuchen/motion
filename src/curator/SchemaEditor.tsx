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
  const [expandSchemata, setExpandSchemata] = useState(true)
  const [displayJSON, setDisplayJSON] = useState(false)

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

  const toggleJSON = () => setDisplayJSON(!displayJSON)
  const toggleCollapse = () => setExpandSchemata(!expandSchemata)

  const { index } = selectedSchema;
  return (
    <>
      <div className="border-2 bg-blue-100 border-blue-200 rounded-md mt-4 p-4">
        <div className="flex">
          <h1 className="font-semibold text-xl">All schemata (click each one to edit):</h1>
          <div className="flex-1"></div>
          <button onClick={toggleJSON} className="btn-dev">&lt;dev&gt; Toggle JSON</button>
          <button onClick={toggleCollapse} className="btn-primary ml-2">{expandSchemata ? "Collapse" : "Expand"}</button>
        </div>
        <div className="mt-4">
          {store.getSchemata.length === 0 ? (
            <div className="mt-2">No schemata yet! Press "Add new Schema" below to create your first schema.</div>
          ) : (
            expandSchemata && store.getSchemata.map((schema, index) => (
              <div
                onClick={() => editHandler(index)}
                className="card mt-2 px-4 py-2 flex cursor-pointer hover:bg-gray-100"
              >
                <span className="w-36 text-2xl">{schema.name}</span>
                <span className="flex-1 flex content-center">{displayJSON && JSON.stringify(schema)}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {!openEditor && (
        <button onClick={() => setOpenEditor(true)} className="btn-primary mt-6">Add new Schema</button>
      )}
      {openEditor && <SchemaBuilder schema={selectedSchema} updateHandler={updateFn(index)} key={index} />}
    </>
  );
};
