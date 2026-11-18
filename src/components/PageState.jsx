// Loading and error messages shared by pages that fetch data.
export function Loading({ text = 'Loading...' }) {
  return <p className="muted" role="status">{text}</p>;
}

export function ErrorBox({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="alert alert--bad" role="alert">
      <span>{error.message || String(error)}</span>
      {onRetry && <button type="button" className="linkbtn" onClick={onRetry}>Try again</button>}
    </div>
  );
}
