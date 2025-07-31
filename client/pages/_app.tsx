import Footer from "../components/Footer";

// ...existing code...

function MyApp({ Component, pageProps }) {
  // ...existing code...
  return (
    <>
      {/* ...existing code... */}
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

// ...existing code...