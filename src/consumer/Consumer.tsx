import { useContext, useState } from "preact/hooks";

import { Attribute, AttributeType, Model } from "../../motion-bee/lib/types";

import { ModelCard } from "./ModelCard";
import { ConsumerEdit } from "./ConsumerEdit";
import { AttributeDefinition, Rule, RuleSet, Schema } from "../shared/types";
import { modelFromSchema, schemaLookup } from "../shared/schemaHelper";
import { RuleStore, StoreHandler } from "../shared/RuleStore";

import { blankRuleStore } from "../shared/RuleStore";
import { RuleStoreContext } from "../app";

enum View {
  Edit = "edit",
  Select = "select",
}

export function Consumer() {
  const [view, setView] = useState(View.Select);
  const store = useContext(RuleStoreContext);
  const [activeRuleset, setActiveRuleset] = useState(store.getRuleSets[0]);

  const changeRuleset = (newRuleset: RuleSet) => {
    setActiveRuleset(newRuleset);
    setView(View.Edit);
  };
  const handleReturnToView = () => {
    setView(View.Select);
  };

  const showComponent = (viewMode: View, handleClick: (_: RuleSet) => void) => {
    switch (viewMode) {
      case View.Edit:
        return <ConsumerEdit handleBack={handleReturnToView} store={store} ruleset={activeRuleset} />;
      case View.Select:
        return (
          <>
            <h1 class="text-2xl font-semibold mt-16">Select a situation to get started</h1>
            <div class="w-11/12 mt-16 rounded border-2 bg-blue-50 border-blue-200 p-4 ml-1 flex flex-wrap">
              {store.getRuleSets.map((ruleset) => (
                <div
                  className="w-64 flex card border-2 ml-8 mt-4 py-12 text-center text-xl cursor-pointer hover:bg-gray-200"
                  onClick={() => handleClick(ruleset)}
                >
                  {ruleset.title}
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return <div className="px-24">{showComponent(view, changeRuleset)}</div>;
}
