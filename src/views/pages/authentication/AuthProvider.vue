<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import { decodeCredential } from 'vue3-google-login';
import { onMounted } from 'vue';
import axios from 'axios';
import sweetalertService from '../../../../service/sweetalertService';

const { global } = useTheme();
const router = useRouter();

const authProviders = [
  {
    name: 'google',
    icon: 'tabler-brand-google-filled',
    color: '#dd4b39',
    colorInDark: '#db4437',
  },
];

const showGoogleLogin = ref(false);

const handleClick = (provider) => {
  if (provider.name === 'google') {
    showGoogleLogin.value = true;
  }
};

const googleCallback = async (response) => {
  try {
    console.log('Google login response', response);
    let profile = decodeCredential(response.credential);
    localStorage.setItem('user', JSON.stringify(profile));
    console.log(profile.email);

    const res = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/check-user`, {
      email: profile.email,
    });

    const result = res.data;
    console.log(result);
    

    if (result.exists) {
      const user = {
        id: result.user.id,
        USERNAME: result.user.USERNAME,
        role: result.user.role,
        FIRST_NAME: result.user.FIRST_NAME,
        LAST_NAME: result.user.LAST_NAME,
        EMAIL: result.user.EMAIL,
      };
      const token = result.user.token;

      document.cookie = `accessToken=${token}; max-age=3600; path=/`;
      document.cookie = `userData=${JSON.stringify(user)}; max-age=3600; path=/`;

      sweetalertService.showSuccessTimeOut(
        "เสร็จสิ้น !",
        "การเข้าสู่ระบบของคุณสำเร็จแล้ว."
      );

      setTimeout(() => {
        router.replace({ name: 'dashboard' });
      }, 1500);
    } else {
      router.push('/register');
    }
  } catch (error) {
    console.error('Error handling Google login:', error);
    if (error.response.status === 403) {

    sweetalertService.showAlertTimeOut(
      "ไอดีนี้ไม่มีอยู่ในระบบ",
      "",
      "error"
    );
      return; 

    // แสดง toast ถ้ามีค่าสถานะ 403
    }
  }
};



</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-1">
    <VBtn
      v-for="link in authProviders"
      :key="link.icon"
      icon
      variant="text"
      size="small"
      :color="global.name.value === 'dark' ? link.colorInDark : link.color"
      @click="handleClick(link)"
    >
      <VIcon size="20" :icon="link.icon" />
    </VBtn>
  </div>
  <div v-if="showGoogleLogin">
    <GoogleLogin
      :callback="googleCallback"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      prompt="login" 
    />
  </div>
</template>
