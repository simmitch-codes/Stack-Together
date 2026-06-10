import './globals.css';

export const metadata = {
  title: 'J.A.R.V.I.S. — Stark Industries OS',
  description: 'Just A Rather Very Intelligent System — personal HUD dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="scanlines" aria-hidden="true" />
      </body>
    </html>
  );
}
