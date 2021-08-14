import { useEffect, useState } from "preact/hooks";
import { StoreHandler } from "../shared/RuleStore";
import { blankRuleSet, RuleSet } from "../shared/types";
import { RuleSetBuilder } from "./RuleSetBuilder";

export const RuleSetEditor = ({ store }: { store: StoreHandler }) => {
  const [selectedRuleSet, setSelectedRuleSet] = useState({
    index: store.getRuleSets.length,
    ...blankRuleSet(),
  });
  const [openEditor, setOpenEditor] = useState(false);
  useEffect(() => {
    setSelectedRuleSet({ index: store.getRuleSets.length, ...blankRuleSet() });
  }, [store]);
  const updateFn = (index: number) => (ruleSet: RuleSet) => {
    store.editRuleSet(index, ruleSet);
    setOpenEditor(false);
  };
  const editHandler = (index: number) => {
    setOpenEditor(true);
    setSelectedRuleSet({ index, ...store.getRuleSets[index] });
  };
  const { index } = selectedRuleSet;
  return (
    <>
      <div>Ruleset Editor</div>
      <div className="border-2 bg-blue-100 border-blue-200 rounded-md mt-4 p-4">
        <div>All rulesets:</div>
        {store.getRuleSets.map((ruleSet, index) => (
          <div className="card mt-2 px-4 py-2 flex cursor-pointer hover:bg-gray-100"
            onClick={() => editHandler(index)}>
            <span className="text-2xl w-64">{ruleSet.title}</span>
            <span className="flex-1">{JSON.stringify(ruleSet, null, 2)}</span>
          </div>
        ))}
      </div>
      {!openEditor && <button onClick={() => setOpenEditor(true)} className="btn-primary mt-12">Add new Ruleset</button>}
      {openEditor && <RuleSetBuilder ruleSet={selectedRuleSet} updateHandler={updateFn(index)} />}
    </>
  );
};
