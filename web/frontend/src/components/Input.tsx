import { ChangeEvent } from "react";

interface InputProps {
  value: string;
  onChange: (v: string) => void;
}

function Input(props: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Modify spaces to include *
    props.onChange(e.target.value.replaceAll(" ", "*"));
  };

  return (
    <input className="input" value={props.value} onChange={handleChange} />
  );
}

export default Input;