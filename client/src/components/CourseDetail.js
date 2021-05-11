import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";

const CourseDetail = ({ context }) => {
  // Get access to the url
  let history = useHistory();
  const id = history.location.pathname.slice(9);

  // State with react hooks
  const [course, setCourse] = useState({});
  const [author, setAuthor] = useState({});
  const [materials, setMaterials] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Get requested course from db based on provided id
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
          if (data.User === undefined) {
            history.push("/error");
          }
          setCourse(data);
          setAuthor(data.User);
          setMaterials(data.materialsNeeded);
        }
      })
      .catch((error) => {
        console.log("Error fetching and parsing data, ", error);
        history.push("/error");
      })
      .finally(() => setIsLoading(false));
    return () => (mounted = false);
  }, [context.data, id, history]);

  const courseOwner = author.id;
  let authenticatedUser;
  let emailAddress;

  if (context.authenticatedUser) {
    authenticatedUser = context.authenticatedUser.id;
    emailAddress = context.authenticatedUser.emailAddress;
  }

  let materialsNeeded;
  if (typeof materials === "string") {
    materialsNeeded = materials.split(",");
  }

  const password = context.authenticatedPassword;

  // Delete course
  const handleDelete = () => {
    const confirmation = window.confirm(
      `Are you sure you want to delete the course "${course.title}"?`
    );
    if (confirmation) {
      context.data.deleteCourse(id, emailAddress, password);
      history.push("/");
    }
  };

  return (
    <main>
      <div className="actions--bar">
        <div className="wrap">
          {/* 
                            Render the delete and update course buttons only if the current 
                            authenticated user owns the current course. Otherwise only render return to list button. 
                        */}
          {context.authenticatedUser && authenticatedUser === courseOwner ? (
            <>
              <a className="button" href={`/courses/${id}/update`}>
                Update Course
              </a>
              <a className="button" href="/" onClick={handleDelete}>
                Delete Course
              </a>
              <a className="button button-secondary" href="/">
                Return to List
              </a>
            </>
          ) : (
            <>
              <a className="button button-secondary" href="/">
                Return to List
              </a>
            </>
          )}
        </div>
      </div>

      <div className="wrap">
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <React.Fragment>
            <h2>Course Detail</h2>
            <form>
              <div className="main--flex">
                <div>
                  <h3 className="course--detail--title">Course</h3>
                  <h4 className="course--name">{course.title}</h4>
                  <p>
                    By: {author.firstName} {author.lastName}
                  </p>
                  <ReactMarkdown children={course.description} />
                </div>
                <div>
                  <h3 className="course--detail--title">Estimated Time</h3>
                  {course.estimatedTime === null ||
                  course.estimatedTime === "" ? (
                    <p>No time estimate available</p>
                  ) : (
                    <p>{course.estimatedTime}</p>
                  )}
                  <h3 className="course--detail--title">Materials Needed</h3>
                  <ul className="course--detail--list">
                    {materials === null ||
                    materialsNeeded === undefined ||
                    materials === "" ? (
                      <p>No materials required for this course</p>
                    ) : (
                      materialsNeeded.map((material, index) => (
                        <ReactMarkdown key={index} children={material} />
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </form>
          </React.Fragment>
        )}
      </div>
    </main>
  );
};
export default withRouter(CourseDetail);
