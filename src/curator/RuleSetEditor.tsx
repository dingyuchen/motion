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
      <div>Rule Set Editor</div>
      <div>All rulesets:</div>
      {store.getRuleSets.map((ruleSet, index) => (
        <div onClick={() => editHandler(index)}>{JSON.stringify(ruleSet)}</div>
      ))}
      {!openEditor && (
        <button onClick={() => setOpenEditor(true)}>Add new Ruleset</button>
      )}
      {openEditor && (
        <RuleSetBuilder
          ruleSet={selectedRuleSet}
          schemata={store.getSchemata}
          updateHandler={updateFn(index)}
        />
      )}
    </>
  );
};
