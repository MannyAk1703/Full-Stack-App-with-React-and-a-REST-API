import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Courses = ({ context }) => {
  let history = useHistory();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current list of courses from the DB
    let mounted = true;
    context.data
      .api("/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "500") {
          history.push("/error");
        }
        if (mounted) {
          setData(data);
        }
      })
      .catch((error) => {
        console.log("Error fetching and parsing data", error);
        history.push("/error");
      })
      .finally(() => setIsLoading(false));
    return () => (mounted = false);
  }, [context.data, history]);

  const courses = data.map((course) => (
    <a
      className="course--module course--link"
      href={`courses/${course.id}`}
      key={course.id}
    >
      <h2 className="course--label">Course</h2>
      <h3 className="course--title">{course.title}</h3>
    </a>
  ));
  return (
    <main>
      <React.Fragment>
        <div className="wrap main--grid">
          {isLoading ? (
            <h2>Loading...</h2>
          ) : (
            <React.Fragment>
              {courses}
              <a
                className="course--module course--add--module"
                href="courses/create"
              >
                <span className="course--add--title">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 13 13"
                    className="add"
                  >
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                  </svg>
                  New Course
                </span>
              </a>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    </main>
  );
};

export default Courses;
