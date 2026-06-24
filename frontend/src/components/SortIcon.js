export function SortIcon({ active, dir }) {
  return (
    <span style={{ marginLeft: 3, opacity: active ? 1 : 0.3, fontSize: 10 }}>
      {active && dir === 'asc' ? '▲' : '▼'}
    </span>
  );
}