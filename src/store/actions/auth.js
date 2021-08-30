import { saveUserInfo, clearUserInfo } from "./user";
import { loginUser, registerUser } from "@/utils/api";
import { Base64 } from "js-base64";
export const login = (username, password) => (dispatch) => {
  console.info(username.trim() + ":" + password);
  var basic = Base64.encode(username.trim() + ":" + password);
  console.info(basic);
  return new Promise((resolve, reject) => {
    loginUser(basic).then((res) => {
      console.log("auth===", res);
      if (res.code === 0) {
        dispatch(saveUserInfo(res.data));
        resolve(res);
      } else {
        reject(res.message);
      }
    });
  });
};

export const register = (username, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    registerUser({ username: username.trim(), password: password }).then(
      (res) => {
        console.log("注册===", res);
        if (res.code === 0) {
          dispatch(saveUserInfo(res.data));
          resolve(res);
        } else {
          reject(res.message);
        }
      }
    );
  });
};

export const logout = () => (dispatch) => {
  console.log("logout");
  dispatch(clearUserInfo());
  window.location.href = "/login";
};
