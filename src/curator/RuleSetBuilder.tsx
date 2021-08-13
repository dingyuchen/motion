import { StateUpdater, useState } from "preact/hooks";
import { AttributeType } from "../../motion-bee/lib/types";
import { blankRule, Rule, RuleSet, Schema } from "../shared/types";
import { immutableReplace } from "../shared/util";
import { RuleBuilder } from "./RuleBuilder";

export const RuleSetBuilder = ({
  ruleSet,
  updateHandler,
  schemata,
}: {
  ruleSet: RuleSet;
  updateHandler: (ruleSet: RuleSet) => void;
  schemata: Schema[];
}) => {
  const [workingRuleSet, setWorkingRuleSet] = useState(ruleSet);
  const { title, rules } = workingRuleSet;
  const addNewBlankRule = () => {
    const newRules = rules.concat(blankRule());
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
    if (
      e instanceof InputEvent &&
      e.currentTarget instanceof HTMLInputElement
    ) {
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
          <RuleBuilder
            rule={rule}
            index={index}
            schemata={schemata}
            ruleUpdateHandler={ruleUpdateHandler(index)}
          />
        ))}
        <button onClick={addNewBlankRule}>Add new rule</button>
      </div>
      <button onClick={() => updateHandler(workingRuleSet)}>Done</button>
    </div>
  );
};
