export const immutableReplace = <V>(array: V[], index: number, value: V) => {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
};
