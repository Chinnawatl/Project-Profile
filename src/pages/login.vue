<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import eecFullLogo from "@images/eecImages/fullLogin.jpg"
import eecLogo from "@images/eecImages/logoEEC.png"
import axios from 'axios';
import sweetalertService from '../../service/sweetalertService';
// import { useRoute, useRouter } from 'vue-router';
// import Router, { router } from '@/plugins/1.router';
import { useRouter } from 'vue-router';

const router = useRouter();

definePage({ meta: { layout: 'blank' } })

const form = ref({
  email: '',
  password: '',

})
const requiredValidator = (value) => !!value || 'กรอกข้อมูล';

const refProductForm = ref(null);
const refValid = ref(true);
const validateProductForm = () => {
  return refProductForm.value?.validate().then(valid => {
    if (valid.valid) {
      refValid.value = true;
    } else {
      refValid.value = false;
    }

    return valid.valid;
  });
};

const isPasswordVisible = ref(false)

const login = async () => {

  const isValid = await validateProductForm();
  console.log(isValid)
  if (!isValid) {
    console.log("ss")
    return;
  }
  console.log("ssss" + form.value.email + "ss" + form.value.password)

  try {
    console.log("ssss")
    const response = await axios.post(`http://localhost:3000/auth/login`, { username: form.value.email, password: form.value.password });
    console.log(response);
    const user = {
      id: response.data.user.id,
      USERNAME: response.data.user.USERNAME,
      role: response.data.user.role,
      FIRST_NAME: response.data.user.FIRST_NAME,
      LAST_NAME: response.data.user.LAST_NAME,
      EMAIL: response.data.user.EMAIL,


    }
    const token = response.data.user.token;
    // Set cookie
    document.cookie = `accessToken=${token}; max-age=3600; path=/`;
    document.cookie = `userData=${JSON.stringify(user)}; max-age=3600; path=/`;
    console.log(user)

    sweetalertService.showSuccessTimeOut(
      "เสร็จสิ้น !",
      "การเข้าสู่ระบบของคุณสำเร็จแล้ว."
    );
    setTimeout(function () {
      router.replace({ name: 'dashboard' });
    }.bind(this), 1500)

  } catch (error) {
    console.log(error)

    if (error.response.status === 401) {

      sweetalertService.showAlertTimeOut(
        "รหัสผ่านผิด",
        "",
        "error"
      );
      return;

      // แสดง toast ถ้ามีค่าสถานะ 401
    }
    if (error.response.status === 500) {
      sweetalertService.showAlertTimeOut(
        "เซิฟเวอร์มีปัญหา",
        "",
        "error"
      );
      return;
    }
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




  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">


        <img class="auth-footer-mask" :src="eecFullLogo" alt="auth-footer-mask" height="100%" width="100" />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <div class="mt-12 mt-sm-0 pa-4 mb-5 d-flex align-center justify-center">
          <img :src="eecLogo" height="180" width="400" />
        </div>
        <VCardText>
          <VForm ref="refProductForm" @submit.prevent="() => { login }">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="form.email"  label="บัญชีผู้ใช้ หรือ อีเมล" type="email" placeholder="johndoe@email.com"
                  autocomplete="current-email" :rules="[requiredValidator]" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="form.password" label="รหัสผ่าน" :rules="[requiredValidator]"
                  placeholder="············" autocomplete="current-password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox v-model="form.remember" label="จดจำรหัสผ่าน" />
                  <a class="text-primary ms-2 mb-1" href="#">
                    ลืมรหัสผ่าน?
                  </a>
                </div>

                <VBtn block type="submit" @click="login">
                  เข้าสู่ระบบ
                </VBtn>
              </VCol>

              <!-- create account -->
              <!-- <VCol cols="12" class="text-center">
                <span>New on our platform?</span>
                <a class="text-primary ms-2" href="#">
                  <VBtn variant="text" @click="$router.push({ name: 'register' })">
                    สร้างบัญชีผู้ใช้ใหม่
                  </VBtn>
                </a> -->
              <!-- </VCol> -->
              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              
            </VRow>
          </VForm>
          <VCol cols="12" class="text-center">
                <AuthProvider />
          </VCol>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
