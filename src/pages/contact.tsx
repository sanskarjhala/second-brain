export const Contact = () => {
  return (
    <div className="my-40 max-w-3xl mx-auto p-6 space-y-6 text-center">
      <h1 className="text-3xl font-bold dark:text-white">Contact Us</h1>
      <p className="text-gray-600 text-xl  dark:text-secondary">
        Have questions or want to connect? Reach out to us anytime!
      </p>

      <div className="space-y-8 text-lg">
        <p className="text-gray-800">
          📧{" "}
          <a
            href="mailto:adityarajxdev@gmail.com"
            className="text-purple-600 hover:underline cursor-pointer"
          >
            sanskarjhala@gmail.com
          </a>
        </p>

        <div className="flex justify-center space-x-6">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-purple-600"
          >
            LinkedIn
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-purple-600"
          >
            X
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-purple-600"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
