import { Logo } from "./logo";
import { evaluator } from "../motion-bee/index";
import { useState } from "preact/hooks"
import {
  AttributeType,
  BooleanFunc,
  CollectionFunc,
  Expression,
  IdentityFunc,
  Model,
  ModelFunc,
} from "../motion-bee/lib/types";

import { Consumer } from './consumer/Consumer'
import { Curator } from './curator/Curator';

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

  const [viewMode, setViewMode] = useState("none")

  const showComponent = () => {
    switch (viewMode) {
      case "curator":
        return (<Curator />)
      case "consumer":
        return <Consumer />
      default: return (
        <>

        </>
      )
    }
  }

  return (
    <>
      <div className="App py-10 bg-gray-100">
        <p>Is your group clear? {JSON.stringify(evaluator(allVaccinated, groupInstance))}</p>
        <p className="mt-4">this section is temporarily here until a proper nav is created</p>
        <div className="mx-auto mt-4 flex w-48 rounded-md border-2">
          <div className="consumerbutton flex-1 w-16 h-10 border-r-2 border-gray-200 cursor-pointer flex items-center justify-center" onClick={() => setViewMode("curator")}>
            Curator
          </div>
          <div className="consumerbutton flex-1 w-16 h-10 cursor-pointer flex items-center justify-center" onClick={() => setViewMode("consumer")}>
            Consumer
          </div>
        </div>
      </div>
      <div>
        {showComponent()}
      </div>
    </>
  );
}
