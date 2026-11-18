import { useId } from 'react';

// Label plus input. Extra props (type, value, onChange, readOnly, required...) go to the input.
export default function Field({ label, hint, ...inputProps }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}{hint && <span className="field__hint"> {hint}</span>}</label>
      <input id={id} className="input" {...inputProps} />
    </div>
  );
}
