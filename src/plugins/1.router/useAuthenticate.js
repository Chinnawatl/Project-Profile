// // useAuthenticate.js

// export function useAuthenticate() {
//     const isAuthenticate = () => {
//       const userData = JSON.parse(localStorage.getItem('USER_DATA'));
//       return userData && userData.token; // Return true ถ้ามี token, false ถ้าไม่มี
//     };
  
//     const getRole = () => {
//       const userData = JSON.parse(localStorage.getItem('USER_DATA'));
//       return userData ? userData.role : null;
//     };
  
//     const $reset = () => {
//       localStorage.removeItem('USER_DATA');
//     };
  
//     return {
//       isAuthenticate,
//       getRole,
//       $reset,
//     };
//   }
  