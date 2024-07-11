"use client";
import { useState } from "react";

export default function Counter({ users }) {
  const [counter, setCounter] = useState(0);
  console.log(users);
  return (
    <div>
      <button onClick={() => setCounter((cur) => cur + 1)}>{counter}</button>
    </div>
  );
}
