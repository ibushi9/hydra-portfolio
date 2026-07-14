const ITEMS = [
  "動画制作",
  "SNSマーケティング",
  "ブランディング",
  "TikTok",
  "Instagram",
  "YouTube",
  "Video Production",
  "Creative Strategy",
  "Brand Identity",
];

export default function MarqueeBand() {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-band">
      <div className="marquee-inner" aria-hidden="true">
        {items.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
