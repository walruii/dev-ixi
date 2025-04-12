export default function Footer({ className }: { className?: string }) {
  <Footer />;
  return (
    <footer className={`p-5 ${className}`}>
      <h1 className="font-bold font-stretch-ultra-expanded text-center">
        DEX_IXI
      </h1>
      <p className="text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} DEX_IXI. All rights reserved. |
        <a href="/terms" className="text-blue-500 hover:underline">
          {" "}
          Terms of Service{" "}
        </a>{" "}
        |
        <a href="/privacy" className="text-blue-500 hover:underline">
          {" "}
          Privacy Policy{" "}
        </a>
      </p>
    </footer>
  );
}
