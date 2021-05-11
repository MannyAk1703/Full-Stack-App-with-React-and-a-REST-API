import React from "react";

// Function component to render when there is no route to match the url

const NotFound = () => {
  return (
    <main>
      <div className="wrap">
        <h2>Not Found</h2>
        <p>Sorry! We couldn't find the page you're looking for.</p>
      </div>
    </main>
  );
};
export default NotFound;
