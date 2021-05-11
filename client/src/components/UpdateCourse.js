import React, { useState, useEffect } from "react";
import Form from "./Form";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";

//A function component that renders a form to updated an existing course.

const UpdateCourse = ({ context }) => {
  let history = useHistory();
  const url = history.location.pathname.slice(9);

  // Regex pattern to get all characters before the '/' after the course id
  const id = url.match(/([^/]+)/)[0];

  let [author, setAuthor] = useState("");
  let [materialsNeeded, setMaterials] = useState("");
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [estimatedTime, setEstimatedtime] = useState("");
  let [errors, setErrors] = useState([]);
  let [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    context.data
      .api(`/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          if (data.message === "Course not found") {
            history.push("/notfound");
          }
          if (data.User && data.User.id !== context.authenticatedUser.id) {
            history.push("/forbidden");
          }
          setCourse(data);
          setAuthor(data.User);
          setMaterials(data.materialsNeeded);
          setTitle(data.title);
          setDescription(data.description);
          setEstimatedtime(data.estimatedTime);
        }
      })
      .catch((error) => {
        console.log("Error fetching and parsing data", error);
        history.push("/error");
      })
      .finally(() => setIsLoading(false));
    return () => (mounted = false);
  }, [context.data, id, course.userId, context.authenticatedUser.id, history]);

  //Function to change state depending on the users input
  const change = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "courseTitle":
        setTitle(value);
        break;
      case "courseAuthor":
        setAuthor(value);
        break;
      case "courseDescription":
        setDescription(value);
        break;
      case "estimatedTime":
        setEstimatedtime(value);
        break;
      case "materialsNeeded":
        setMaterials(value);
        break;
      default:
        return;
    }
  };

  if (estimatedTime === null) {
    estimatedTime = "";
  }
  if (materialsNeeded === null) {
    materialsNeeded = "";
  }

  // Fucntion to cancel and redirect to the main page.
  const cancel = () => {
    history.push(`/courses/${id}`);
  };

  // Function to submit the form.
  const submit = () => {
    const course = {
      title,
      author,
      description,
      estimatedTime,
      materialsNeeded,
    };

    const emailAddress = context.authenticatedUser.emailAddress;
    const password = context.authenticatedPassword;

    //Function to update an existing course in the database
    context.data
      .updateCourse(emailAddress, password, id, course)
      .then((errors) => {
        if (errors.length) {
          setErrors(errors);
        } else {
          history.push("/");
          console.log("You have successfully updated the course!");
        }
      })
      .catch((err) => {
        console.log(err);
        history.push("/error");
      });
  };

  return (
    <main>
      <div className="wrap">
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <React.Fragment>
            <h2>Update Course</h2>
            <Form
              id={id}
              cancel={cancel}
              submit={submit}
              errors={errors}
              submitButtonText="Update Course"
              elements={() => (
                <React.Fragment>
                  <div>
                    <label htmlFor="courseTitle">Course Title</label>
                    <input
                      id="courseTitle"
                      name="courseTitle"
                      type="text"
                      value={title}
                      onChange={change}
                    />
                    <label htmlFor="courseAuthor">Course Author</label>
                    <input
                      id="courseAuthor"
                      name="courseAuthor"
                      type="text"
                      value={`${author.firstName} ${author.lastName}`}
                      onChange={change}
                    />
                    <label htmlFor="courseDescription">
                      Course Description
                    </label>
                    <textarea
                      id="courseDescription"
                      name="courseDescription"
                      value={description}
                      onChange={change}
                    />
                  </div>
                  <div>
                    <label htmlFor="estimatedTime">Estimated Time</label>
                    <input
                      id="estimatedTime"
                      name="estimatedTime"
                      type="text"
                      value={estimatedTime}
                      onChange={change}
                    />
                    <label htmlFor="materialsNeeded">Materials Needed</label>
                    <textarea
                      id="materialsNeeded"
                      name="materialsNeeded"
                      value={materialsNeeded}
                      onChange={change}
                    />
                  </div>
                </React.Fragment>
              )}
            />
          </React.Fragment>
        )}
      </div>
    </main>
  );
};
export default withRouter(UpdateCourse);
