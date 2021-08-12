import { useState } from "preact/hooks";
import { Consumer } from "./consumer/Consumer";
import { Curator } from "./curator/Curator";
import { blankRuleStore, RuleStore, StoreHandler } from "./shared/RuleStore";

enum View {
  Curator = "curator",
  Consumer = "consumer",
}

export function App() {
  const [view, setView] = useState(View.Consumer);
  const [ruleStore, setRuleStore] = useState(blankRuleStore());
  const storeHandler = new StoreHandler(ruleStore, setRuleStore);
  
  const showComponent = (viewMode: View) => {
    switch (viewMode) {
      case View.Curator:
        return <Curator store={storeHandler} />;
      case View.Consumer:
        return <Consumer store={storeHandler}/>;
    }
  };

  return (
    <>
      <div class="App py-10 bg-gray-100">
        <div class="mx-auto mt-4 flex w-48 rounded-md border-2">
          <div
            class={`curatorbutton flex-1 w-16 h-10 border-r-2 border-gray-200 cursor-pointer flex items-center justify-center rounded-l-sm
            ${view === View.Curator ? "bg-white" : ""}`}
            onClick={() => setView(View.Curator)}
          >
            Curator
          </div>
          <div
            class={`consumerbutton flex-1 w-16 h-10 cursor-pointer flex items-center justify-center rounded-r-sm
            ${view === View.Consumer ? "bg-white" : ""}`}
            onClick={() => setView(View.Consumer)}
          >
            Consumer
          </div>
        </div>
      </div>
      <div>{showComponent(view)}</div>
    </>
  );
}
