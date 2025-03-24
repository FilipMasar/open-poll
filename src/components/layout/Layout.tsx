import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'OpenPoll - Open-ended Poll Application' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="A simple open-ended poll application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      </Head>
      <div className="bg-gray-50 min-h-screen">
        {children}
      </div>
    </>
  );
};

export default Layout; 