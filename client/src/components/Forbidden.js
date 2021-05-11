import React from "react";

//Function component to render if the requested course isn't owned by the authenticated user.

const Forbidden = () => {
  return (
    <main>
      <div className="wrap">
        <h2>Forbidden</h2>
        <p>Oh oh! You can't access this page.</p>
      </div>
    </main>
  );
};

export default Forbidden;
