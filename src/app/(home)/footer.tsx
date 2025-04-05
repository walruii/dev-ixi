export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between">
          <h1 className="text-3xl font-stretch-ultra-expanded font-mono font-bold">
            DEV_IXI
          </h1>

          <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right dark:text-gray-400">
            Copyright &copy; 2022. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
