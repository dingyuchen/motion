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
    <div>
      <div>
        RuleSet Builder
        <div>
          <input type="text" label={title} onInput={nameChangeHandler} />
        </div>
        Rules (disjunctive):
        {rules.map((rule, index) => (
          <RuleBuilder rule={rule} index={index} ruleUpdateHandler={ruleUpdateHandler(index)} />
        ))}
        <button onClick={addNewBlankRule}>Add new rule</button>
      </div>
      {warningMsg && <div>{warningMsg}</div>}
      <button onClick={() => updateHandler(workingRuleSet)}>Done</button>
    </div>
  );
};
