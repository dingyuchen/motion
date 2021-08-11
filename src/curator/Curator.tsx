import { StoreHandler } from "../shared/RuleStore";
import { SchemaEditor } from "./SchemaEditor";
import { RuleSetEditor } from "./RuleSetEditor";

export const Curator = ({ store }: { store: StoreHandler }) => {
  return (
    <div className="mt-16 border-2 border-gray-200">
      <h1>CURATOR VIEW</h1>
      <SchemaEditor store={store} />
      <RuleSetEditor store={store} />
    </div>
  );
};
