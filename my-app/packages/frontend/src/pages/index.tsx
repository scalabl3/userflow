import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>My App</title>
        <meta name="description" content="Welcome to My App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to My App
        </h1>
        <p className="text-lg text-gray-700">
          This is a modern monorepo application built with Next.js, NestJS, and TypeScript.
        </p>
      </main>
    </div>
  );
};

export default Home; 