import type { ReactNode } from 'react';

type WebsiteLayoutProps = {
  readonly children: ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <div>
      <h1>Website Layout</h1>
      {children}
    </div>
  );
}
