import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const Coursecomponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeTOlogin = () => {
    navigate("/login");
  };

  const [courseData, setCourseData] = useState([]);
  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role === "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            console.log(data);
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [currentUser]);
  const handleDelete = () => {
    if (window.confirm("確定要刪除此課程嗎？")) {
      CourseService.delete(courseData[0]._id)
        .then((data) => {
          console.log(data);
          window.alert("課程已刪除");
          navigate("/course");
        })
        .catch((e) => {
          console.log(e);
          window.alert("刪除失敗");
        });
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeTOlogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length !== 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    課程描述:{course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格:{course.price}
                  </p>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleDelete}
                  >
                    刪除課程
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Coursecomponent;
