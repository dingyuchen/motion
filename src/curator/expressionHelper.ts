import { Expression, LogicalFunc } from "../../motion-bee/lib/types";

export const junction = (op: LogicalFunc, exprs: Expression[]): Expression => {
  if (exprs.length === 1) {
    return exprs[0];
  }
  if (exprs.length === 2) {
    return { op, args: exprs };
  }

  const left = exprs.slice(0, Math.floor(length / 2));
  const right = exprs.slice(Math.floor(length / 2));
  return { op, args: [junction(op, left), junction(op, right)] };
};

export const conjunction = (exprs: Expression[]) =>
  junction(LogicalFunc.And, exprs);
export const disjunction = (exprs: Expression[]) =>
  junction(LogicalFunc.Or, exprs);
