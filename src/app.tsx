import { Logo } from "./logo";
import { evaluator } from "../motion-bee/index";
import {
  AttributeType,
  BooleanFunc,
  CollectionFunc,
  Expression,
  IdentityFunc,
  Model,
  ModelFunc,
} from "../motion-bee/lib/types";

export function App() {
  const alice: Model = {
    attributes: [
      { label: "vaccinated", type: AttributeType.Boolean, value: true },
      { label: "age", type: AttributeType.Number, value: 20 },
    ],
    type: AttributeType.Model,
    label: "person",
  };
  const bob: Model = {
    attributes: [
      { label: "vaccinated", type: AttributeType.Boolean, value: false },
      { label: "age", type: AttributeType.Number, value: 11 },
    ],
    type: AttributeType.Model,
    label: "person",
  };
  const charlie: Model = {
    attributes: [
      { label: "vaccinated", type: AttributeType.Boolean, value: true },
      { label: "age", type: AttributeType.Number, value: 90 },
    ],
    type: AttributeType.Model,
    label: "person",
  };
  const daniel: Model = {
    attributes: [
      { label: "vaccinated", type: AttributeType.Boolean, value: false },
      { label: "age", type: AttributeType.Number, value: 30 },
    ],
    type: AttributeType.Model,
    label: "person",
  };
  const groupInstance: Model = {
    attributes: [
      {
        label: "group",
        type: AttributeType.Collection,
        value: [alice, bob, charlie, daniel],
      },
      { label: "same household", type: AttributeType.Boolean, value: true },
    ],
    type: AttributeType.Model,
    label: "group",
  };

  const isVaccinated: Expression = {
    args: [
      {
        args: ["vaccinated"],
        op: ModelFunc.Lookup,
      },
    ],
    op: BooleanFunc.IsChecked,
  };

  const allVaccinated: Expression = {
    args: [
      {
        args: ["group"],
        op: ModelFunc.Lookup,
      },
      {
        args: [isVaccinated],
        op: IdentityFunc.Lambda,
      },
    ],
    op: CollectionFunc.AllOf,
  };

  return (
    <>
      <Logo />
      <p>Hello Vite + Preact!</p>
      <p>
        <a
          class="link"
          href="https://preactjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Is your group clear?
        </a>
        {JSON.stringify(evaluator(allVaccinated, groupInstance))}
      </p>
    </>
  );
}
