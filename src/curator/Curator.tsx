import { useState } from "preact/hooks";
import { StoreHandler } from "../shared/RuleStore";
import { RulesetEditor } from "./RulesetEditor";
import { SchemaEditor } from "./SchemaEditor";
import { RuleSetEditor } from "./RuleSetEditor";

enum View {
  Schema = "schema",
  Ruleset = "ruleset",
}

export const Curator = ({ store }: { store: StoreHandler }) => {
  const [view, setView] = useState(View.Schema);

  const showComponent = (viewMode: View) => {
    switch (viewMode) {
      case View.Schema:
        return <SchemaEditor store={store} />;
      case View.Ruleset:
        return <RulesetEditor store={store} />;
    }
  };
  return (
    <div className="mt-16 border-gray-200 px-24">
      <h1>CURATOR VIEW</h1>
      <div class="mx-auto mt-4 flex w-48 rounded-md border-2 bg-gray-100">
        <div
          class={`curatorbutton flex-1 w-16 h-10 border-r-2 border-gray-200 cursor-pointer flex items-center justify-center rounded-l-sm 
            ${view === View.Schema ? "bg-white" : ""}`}
          onClick={() => setView(View.Schema)}
        >
          Schema
        </div>
        <div
          class={`consumerbutton flex-1 w-16 h-10 cursor-pointer flex items-center justify-center rounded-r-sm 
            ${view === View.Ruleset ? "bg-white" : ""}`}
          onClick={() => setView(View.Ruleset)}
        >
          Ruleset
        </div>
      </div>
      {showComponent(view)}
    </div>
  );
};
