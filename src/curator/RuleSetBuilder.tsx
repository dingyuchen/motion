import { StateUpdater, useContext, useState } from "preact/hooks";
import { RuleStoreContext } from "../app";
import { blankRule, Rule, RuleSet, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";
import { RuleBuilder } from "./RuleBuilder";

export const RuleSetBuilder = ({
  ruleSet,
  updateHandler,
}: {
  ruleSet: RuleSet;
  updateHandler: (ruleSet: RuleSet) => void;
}) => {
  const schemata = useContext(RuleStoreContext).getSchemata;
  const [workingRuleSet, setWorkingRuleSet] = useState(ruleSet);
  const [warningMsg, setWarningMsg] = useState("");
  const { title, rules } = workingRuleSet;
  const warn = (msg: string) => {
    setWarningMsg(msg);
    setTimeout(() => {
      setWarningMsg("");
    }, 1000);
  };
  const addNewBlankRule = () => {
    if (schemata.length === 0) {
      return warn("Add new Schema first");
    }
    const defaultRule = { ...blankRule(), input: schemata[0] };
    const newRules = rules.concat(defaultRule);
    setWorkingRuleSet((prev) => ({ ...prev, rules: newRules }));
  };
  const ruleUpdateHandler = (index: number) => (rule: Rule) => {
    setWorkingRuleSet((prev) => {
      const { rules } = prev;
      return {
        ...prev,
        rules: immutableReplace(rules, index, rule),
      };
    });
  };
  const nameChangeHandler = (e: Event) => {
    if (e instanceof InputEvent && e.currentTarget instanceof HTMLInputElement) {
      const title = e.currentTarget.value;
      setWorkingRuleSet((prev) => ({ ...prev, title }));
    }
  };

  return (
    <div className="card mt-12 px-4 py-4">
      <div>
        <h1 className="font-semibold text-2xl">New Ruleset</h1>
        <div className="mt-4">
          <input type="text" value={title} placeholder="Title of ruleset" onInput={nameChangeHandler} className="text-xl font-semibold py-2 px-2"/>
        </div>
        <h2 className="text-lg font-semibold mt-6">Rules (disjunctive):</h2>
        {rules.map((rule, index) => (
          <RuleBuilder rule={rule} index={index} ruleUpdateHandler={ruleUpdateHandler(index)} />
        ))}
        <button onClick={addNewBlankRule} className="btn-primary mt-8">Add new rule</button>
      </div>
      {warningMsg && <div>{warningMsg}</div>}
      <button onClick={() => updateHandler(workingRuleSet)} className="btn-good mt-10">Done</button>
    </div>
  );
};
