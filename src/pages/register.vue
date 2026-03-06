/*
* file name : register
* What is it used for : Register account information to the system
* Author : Chinnawat Leekpai
* Create date : 18 July 2024
*/

<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import eecFullLogo from "@images/eecImages/fullLogin.jpg"
import eecLogo from "@images/eecImages/logoEEC.png"
import axios from 'axios';
import sweetalertService from '../../service/sweetalertService';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue'
const router = useRouter();

definePage({ meta: { layout: 'blank' } })

const form = ref({
  email: '',
  password: '',
})

const getLocal = ref(null);
const refProductForm = ref(null);
const refValid = ref(true);
const showPassword1 = ref(false)
const showPassword2 = ref(false)

const positionData = ref({
  user_first_name: '',
  user_last_name: '',
  user_email: '',
  user_role: '66861995f74f22f8a7f40dc6',
  user_status: 'Activate',
  user_username: form.value.email,
  user_password: form.value.password,
  user_picture: '',
});

// Watch for changes in getLocal and update positionData
watch(getLocal, (newValue) => {
  if (newValue) {
    positionData.value = {
      user_first_name: newValue.given_name || '',
      user_last_name: newValue.family_name || '',
      user_email: newValue.email || '',
      user_role: '66861995f74f22f8a7f40dc6',
      user_status: 'Activate',
      user_username: form.value.email || '',
      user_password: form.value.password || '',
      user_picture: newValue.picture || '',
    };
  }
}, { immediate: true });

const rules = {
  required: (value) => !!value || 'Required.',
  min: (v) => v.length >= 8 || 'Min 8 characters',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
  matchPassword: (value) => value === positionData.value.user_password || 'Passwords do not match',
}

const validateProductForm = () => {
  return refProductForm.value?.validate().then(valid => {
    refValid.value = valid.valid;
    return valid.valid;
  });
};

const handleFormSubmit = async () => {
  try {
    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/register/eec_users`, {
      data: positionData.value,
    });
    
    if (result && result.data && result.data.user) {
      const user = {
        id: result.data.user.id,
        USERNAME: result.data.user.USERNAME,
        role: result.data.user.role,
        FIRST_NAME: result.data.user.FIRST_NAME,
        LAST_NAME: result.data.user.LAST_NAME,
        EMAIL: result.data.user.EMAIL,
      };
      const token = result.data.user.token;

      // Set cookies
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
      console.log('API response:', result);

      sweetalertService.showErrorTimeOut("Error", "Invalid response from server.");
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
        console.log("1");
        sweetalertService.showErrorTimeOut("Error", "มีผู้ใช้งานนี้ไปแล้ว.");
    } else {
        console.log("2")
        console.log(error);
        sweetalertService.showErrorTimeOut("Error", "An error occurred.");
    }
  }
};

onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    getLocal.value = JSON.parse(userData);
    console.log(getLocal.value.given_name);
  } else {
    console.warn('No user data found in localStorage.');
    getLocal.value = {}; // Set an empty object as default
  }
});
</script>


<template>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <img class="auth-footer-mask" :src="eecFullLogo" alt="auth-footer-mask" height="100%" width="100" />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <div class="mt-12 mt-sm-0 pa-4 mb-5 d-flex align-center justify-center">
          <img :src="eecLogo" height="130" width="250" />
        </div>

        <VCardText>
          <VForm ref="refProductForm" @submit.prevent="handleFormSubmit">
            <VRow>
             
              <!-- user_username -->
              <VCol cols="12" >
                <AppTextField v-model="positionData.user_username" label="Username" placeholder="Username"
                  :rules="[rules.required]" />
              </VCol>
              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="positionData.user_password"
                    :append-inner-icon="showPassword1 ? 'tabler-eye-off' : 'tabler-eye'" label="Password"
                    hint="At least 8 characters" placeholder="············" :rules="[rules.required, rules.min]"
                    :type="showPassword1 ? 'text' : 'password'" name="input-10-1" counter
                    @click:append-inner="showPassword1 = !showPassword1" />
                <AppTextField v-model="positionData.confirmPassword"
                  :append-inner-icon="showPassword2 ? 'tabler-eye-off' : 'tabler-eye'" label="Confirm Password"
                  hint="At least 8 characters" placeholder="············"
                  :rules="[rules.required, rules.min, rules.matchPassword]" :type="showPassword2 ? 'text' : 'password'"
                  name="input-10-1" counter @click:append-inner="showPassword2 = !showPassword2" />

                

                <!-- เมื่อกด Sing Up แล้วให้ไปยังหน้า Login -->
                <VBtn block type="submit" >
                  Sing Up
                </VBtn>
              </VCol>
             
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
