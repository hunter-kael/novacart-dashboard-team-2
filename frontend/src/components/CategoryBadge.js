import {categoryColor} from '../utils/utils';

export function CategoryBadge({ category }) {
  const { bg, text } = categoryColor(category);
  return (
    <span style={{
      display: 'inline-block',
      background: bg,
      color: text,
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 4,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
    }}>
      {category}
    </span>
  );
}