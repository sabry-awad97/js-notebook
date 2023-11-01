import { useState } from "react";
import "./App.css";
import { useEsbuild } from "./bundler/hooks";

const App = () => {
  const [input, setInput] = useState("const a = 1;");
  const [code, setCode] = useState("");

  const transformCode = useEsbuild();

  const handleClick = async () => {
    const code = await transformCode(input);
    setCode(code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
