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
      <div className="border-2 mt-4 p-4">
        <h1 className="font-semibold text-xl">All models (click to edit):</h1>
        {store.getSchemata.map((schema, index) => (
          <div onClick={() => editHandler(index)} className="border-2 mt-2 px-4 py-2 flex cursor-pointer hover:bg-gray-100">
            <span className="w-36 text-2xl">{schema.name}</span>
            <span className="flex-1 flex content-center">{JSON.stringify(schema)}</span>
          </div>
        ))}
      </div>
      {!openEditor && (
        <button onClick={() => setOpenEditor(true)} className="border-2 mt-6 w-max px-4 py-4 cursor-pointer hover:bg-indigo-600 hover:text-white
        text-center font-semibold">Add new Schema</button>
      )}
      {openEditor && (
        <SchemaBuilder
          schema={selectedSchema}
          schemaSpace={schemaSpace}
          updateHandler={updateFn(index)}
          key={index}
        />
      )}
    </>
  );
};
