
export const calculate = async (expression: string) => {
  const match = expression.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*$/
  );

  if (!match) {
    throw new Error("Invalid mathematical expression");
  }

  const a = Number(match[1]);
  const operator = match[2];
  const b = Number(match[3]);

  let result: number;

  switch (operator) {
    case "+":
      result = a + b;
      break;

    case "-":
      result = a - b;
      break;

    case "*":
      result = a * b;
      break;

    case "/":
      if (b === 0) {
        throw new Error("Division by zero");
      }
      result = a / b;
      break;

    default:
      throw new Error("Unsupported operator");
  }

  return {
    expression,
    result,
  };
};
