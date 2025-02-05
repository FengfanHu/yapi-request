// import axios, { AxiosRequestConfig } from "axios";

// // 正在登录期间，把新来的登录放入登录池中，待登录完成后再完成后续登录
// // 是否正在登录
// // 请求池
// const requestPool: any[] = [];

// const request = axios.create({
//   withCredentials: true,
//   timeout: 30000, // 超时时间30秒
//   headers: {
//     "Content-Type": "application/json;charset=UTF-8",
//   },
// });

// const yapiReq = {
//   get(path: string, config: AxiosRequestConfig = {}) {
//     return request({
//       method: "GET",
//       url: path,
//       ...config,
//     });
//   },
//   post(path: string, config: AxiosRequestConfig = {}) {
//     return request({
//       method: "POST",
//       url: path,
//       ...config,
//     });
//   },
// };

// export default yapiReq;
