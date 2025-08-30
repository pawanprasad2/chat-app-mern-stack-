const AuthPatternBubbles = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="flex flex-col gap-3 mb-8">
          <div className="self-start bg-primary/20 px-4 py-2 rounded-2xl animate-pulse">
            Hello 👋
          </div>
          <div className="self-end bg-secondary/20 px-4 py-2 rounded-2xl animate-bounce">
            Welcome back!
          </div>
          <div className="self-start bg-primary/20 px-4 py-2 rounded-2xl animate-pulse">
            Ready to chat?
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};


export default AuthPatternBubbles