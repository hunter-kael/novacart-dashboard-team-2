function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h) % 360;
}

function avatarColor(name) {
  const hue = hashHue(name);
  return {
    bg:   `hsla(${hue}, 50%, 45%, 0.15)`,
    text: `hsl(${hue}, 50%, 38%)`,
  };
}

export function Avatar({ name }) {
  const { bg, text } = avatarColor(name);
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: bg,
      color: text,
      fontSize: 11,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {initials(name)}
    </div>
  );
}
