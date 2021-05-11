import React from "react";

//Function component to render when there is an unexpected error.

const UnhandledError = () => {
  return (
    <main>
      <div className="wrap">
        <h2>Error</h2>
        <p>Sorry! We just encountered an unexpected error.</p>
      </div>
    </main>
  );
};
export default UnhandledError;
