import React from 'react';

const AuthImagePattern = ({ title, subtitle }) => {

  const numberOfSquares = 9;

  return (
    <section className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(numberOfSquares)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${
                i % 2 === 0 ? "bg-primary/30 animate-pulse" : "bg-secondary/30"
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-base-content">
          {title}
        </h2>
        <p className="text-base-content/60">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default AuthImagePattern;
