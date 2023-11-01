import { useState } from "react";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("const a = 1;");
  const [code, setCode] = useState("");

  const handleClick = () => {
    console.log(input);
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
