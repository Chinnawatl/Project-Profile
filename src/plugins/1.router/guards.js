import { canNavigate } from '@layouts/plugins/casl'
import axios from 'axios';


export const setupGuards = (router) => {
  router.beforeEach(async (to, from, next) => {
    console.log(`Navigating to: ${to.name}`);

    // ข้ามการตรวจสอบโทเค็นสำหรับหน้าลงทะเบียน
    if (to.name === 'register') {
      console.log('Bypassing token check for registration page');
      next();
      return;
    }

    if (to.name === 'login') {
      console.log('Handling login route');
      // ลบคุกกี้ accessToken
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // ลบคุกกี้ userData
      document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      next();
    } else {
      try {
        console.log('Checking token validity');
        const accessTokenCookie = useCookie('accessToken');
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value,
        };

        const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/get/check-token`, { headers });
        console.log('Token check response:', response);

        if (response.status !== 200) {
          console.log('Token invalid, redirecting to login');
          next({ name: 'login' });
        } else {
          const userRoleCookie = useCookie('userData');
          const restrict = to.meta.restriction;
          const userRole = userRoleCookie.value.role;

          if (restrict) {
            if (restrict.includes(userRole)) {
              console.log('User role authorized, proceeding');
              next();
            } else {
              console.log('User role not authorized, redirecting');
              next({ name: 'not-authorized' });
            }
          } else {
            console.log('No restrictions, proceeding');
            next();
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
        next({ name: 'login' });
      }
    }
  });
};

