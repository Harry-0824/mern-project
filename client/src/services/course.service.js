import axios from "axios";
const API_URL = "https://mern-project-73375b7b705a.herokuapp.com/api/courses";

class CourseService {
  //取得所有課程
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      {
        title,
        description,
        price,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  //使用學生id,找到學生所報名的課程
  getEnrolledCourses(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
  //使用instructor id來找到講師擁有的課程
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
  //使用課程名稱來找到課程
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByName/" + name, {
      headers: {
        Authorization: token,
      },
    });
  }
  //註冊課程
  enroll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  //刪除課程
  delete(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios
      .delete(API_URL + "/" + _id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        //刪除成功後刷新頁面
        window.location.reload();
        return response;
      })
      .catch((e) => {
        console.log("課程刪除失敗" + e);
      });
  }
}

export default new CourseService();
