import "./globals.css";

export const metadata = {
  title: "Hydra — 魅せる技術。広める戦略。",
  description: "魅せる技術。広める戦略。新潟発のクリエイティブカンパニー Hydra",
  openGraph: {
    title: "Hydra — 魅せる技術。広める戦略。",
    description: "新潟発のクリエイティブカンパニー Hydra。動画制作・SNSマーケティング・ブランディング。",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&family=Noto+Sans+JP:wght@300;400;700;900&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="lock">{children}</body>
    </html>
  );
}
