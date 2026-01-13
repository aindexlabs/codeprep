export type Question = {
  id: string;
  category: 'JavaScript' | 'TypeScript' | 'React';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  example: string;
  link: string;
};

export const questions: Question[] = [
  {
    id: 'js-1',
    category: 'JavaScript',
    level: 'Beginner',
    title: 'Explain the difference between `let`, `const`, and `var`.',
    description: 'This fundamental question tests your knowledge of variable declarations and scoping in JavaScript. `var` is function-scoped, while `let` and `const` are block-scoped. `const` variables cannot be reassigned.',
    example: `function scopeTest() {
  var x = 1;
  let y = 2;
  const z = 3;

  if (true) {
    var x = 10; // Same variable
    let y = 20; // New variable, scoped to this block
    const z = 30; // New variable, scoped to this block
    console.log(x, y, z); // 10, 20, 30
  }
  
  console.log(x, y, z); // 10, 2, 3
}

scopeTest();`,
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let'
  },
  {
    id: 'js-2',
    category: 'JavaScript',
    level: 'Intermediate',
    title: 'What is a closure in JavaScript?',
    description: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function’s scope from an inner function.',
    example: `function makeAdder(x) {
  // Parameter 'x' is part of the parent's lexical environment
  return function(y) {
    // This inner function is a closure. It "closes over" 'x'.
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12`,
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'
  },
  {
    id: 'ts-1',
    category: 'TypeScript',
    level: 'Beginner',
    title: 'What are the basic types in TypeScript?',
    description: 'TypeScript extends JavaScript with a rich type system. The basic types include `boolean`, `number`, `string`, `array`, `tuple`, `enum`, `any`, `void`, `null` and `undefined`, `never`, and `object`.',
    example: `let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let person: [string, number] = ['John', 30]; // Tuple

enum Color {Red, Green, Blue}
let c: Color = Color.Green;`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html'
  },
  {
    id: 'ts-2',
    category: 'TypeScript',
    level: 'Intermediate',
    title: 'Explain the difference between an `interface` and a `type` alias.',
    description: '`interface` and `type` are very similar and can often be used interchangeably. However, a key difference is that interfaces are open for extension (declaration merging), while type aliases are not. Types can also represent more complex constructs like unions or tuples.',
    example: `// Interface - can be merged
interface User {
  name: string;
}
interface User {
  age: number;
}
const user: User = { name: "Alice", age: 25 };

// Type - cannot be merged, but can be a union
type StringOrNumber = string | number;
type Point = {
  x: number;
  y: number;
};`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces'
  },
  {
    id: 'react-1',
    category: 'React',
    level: 'Beginner',
    title: 'What is JSX?',
    description: 'JSX (JavaScript XML) is a syntax extension for JavaScript recommended by React. It allows you to write HTML-like markup inside a JavaScript file, which makes creating UI components more intuitive. JSX expressions are transpiled into `React.createElement()` calls.',
    example: `// This JSX code:
const element = <h1 className="greeting">Hello, world!</h1>;

// Is transpiled into this:
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);`,
    link: 'https://react.dev/learn/writing-markup-with-jsx'
  },
  {
    id: 'react-2',
    category: 'React',
    level: 'Intermediate',
    title: 'Explain the `useEffect` Hook.',
    description: 'The `useEffect` Hook lets you perform side effects in function components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes, but unified into a single API. It runs after every render by default, but you can control when it runs by passing a dependency array.',
    example: `import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  // Runs only once, like componentDidMount
  useEffect(() => {
    const timerId = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // Cleanup function, runs on unmount
    return () => clearInterval(timerId);
  }, []);

  // Runs whenever 'count' changes
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click me</button>;
}`,
    link: 'https://react.dev/reference/react/useEffect'
  }
];
