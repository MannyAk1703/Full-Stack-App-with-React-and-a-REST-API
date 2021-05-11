import React from "react";
import { useHistory } from "react-router-dom";

//Function component that renders a form
const Form = (props) => {
  let history = useHistory();
  const form = history.location.pathname.slice(9);

  const { id, cancel, errors, submit, submitButtonText, elements } = props;

  // Function to handle submitting the form
  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  // Function to handle canelling the form
  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  return (
    <>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        {form !== "create" && form !== `${id}/update` ? (
          <React.Fragment>
            {elements()}
            <button className="button" type="submit">
              {submitButtonText}
            </button>
            <button className="button button-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="main--flex">{elements()}</div>
            <button className="button" type="submit">
              {submitButtonText}
            </button>
            <button className="button button-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </React.Fragment>
        )}
      </form>
    </>
  );
};

//Function to handle displaying validation errors above the form
function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;

  if (errors.length) {
    errorsDisplay = (
      <div className="validation--errors">
        <h3>Validation Errors</h3>
        <ul>
          {errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }
  return errorsDisplay;
}

export default Form;
