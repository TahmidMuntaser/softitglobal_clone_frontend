import './globals.css';

export const metadata = {
  title: 'SoftITGlobal Clone Frontend',
  description: 'Next.js frontend scaffold for the ecommerce clone.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}