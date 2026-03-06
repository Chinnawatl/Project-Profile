/*
* file name : addAccount
* What is it used for : Adding account information to the system
* Author : Chinnawat Leekpai
* Create date : 19 June 2024
*/

<script setup lang="js">
import userPicture from '@images/eecImages/user.png';
import axios from 'axios';
import bcrypt from "bcryptjs";
import { ref } from "vue";
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { VForm } from 'vuetify/components/VForm';
import { VCol } from 'vuetify/lib/components/index.mjs';
import sweetalertService from '../../../service/sweetalertService';
import { Filler } from 'chart.js';
const { t } = useI18n();


const items = [
  { title: "Super Admin", value: "66822fcb46d6914e3d7d9c43" },
  { title: "Admin System", value: "6684f800fc9847e2ec4d1dfc" },
  { title: "User", value: "66861983f74f22f8a7f40dc4" },
  { title: "External", value: "66861995f74f22f8a7f40dc6" },
  { title: "Dev", value: "6699e3050009dae6f4ac5ea6" },
];

const role = ref()
const positionData = ref({
  user_first_name: '',
  user_last_name: '',
  user_number_phone: '',
  user_email: '',
  user_role: role,
  user_status: 'Activate',
  user_username: '',
  user_password: '',
  user_picture: ref(userPicture),

});

const refInputEl = ref()
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const refAccountForm = ref()
const route = useRoute();
const router = useRouter();

const rules = {
  required: (value) => !!value || t('MangeAccount.rules.Required'),
  min: (v) => v.length >= 8 || t('MangeAccount.rules.min'),
  email: (value) => /.+@.+\..+/.test(value) || t('MangeAccount.rules.rulesemail'),
  matchPassword: (value) => value === positionData.value.user_password || t('MangeAccount.rules.matchPassword'),
}

/**
 * ชื่อฟังก์ชัน (Name Fuction) : changeAvatar
 * ฟังก์ชันทำอะไร (What can the function do?) : เปลี่ยนรูปภาพอวาตาร์ของผู้ใช้ และแปลงรูปภาพเป็น blo
 * มีค่าอะไรบ้าง (param) : file - อ็อบเจกต์ที่เก็บไฟล์ที่ผู้ใช้เลือก
 * ส่งค่าอะไร (Return) : None
//  */
const resizeImage = (file, maxWidth, maxHeight, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const isPng = file.type === 'image/png';
      const mimeType = isPng ? 'image/jpeg' : file.type;

      canvas.toBlob(blob => {
        if (blob) {
          resolve({ blob, mimeType });
        } else {
          reject(new Error('Error resizing image.'));
        }
      }, mimeType, quality);
    };

    img.onerror = reject;
  });
};

const changeAvatar = async (file) => {
  const fileReader = new FileReader();
  const { files } = file.target;
  const maxFileSize = 800 * 1024; // 800 KB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

  if (files && files.length) {
    const selectedFile = files[0];
    console.log("000");

    if (!allowedTypes.includes(selectedFile.type)) {
      sweetalertService.showAlertTimeOut('File type error', 'Only PNG, JPG, and GIF files are allowed.', 'error');
      file.target.value = '';
      console.log("111");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      sweetalertService.showAlertTimeOut('File size error', 'File size should be less than 800 KB.', 'error');
      file.target.value = '';
      console.log("222");
      return;
    }

    try {
      const { blob: resizedBlob, mimeType } = await resizeImage(selectedFile, 800, 800);

      fileReader.readAsDataURL(resizedBlob);
      fileReader.onload = () => {
        const result = fileReader.result;
        if (typeof result === 'string') {
          positionData.value.user_picture = result;

          const base64Data = result.split(',')[1];
          const binaryString = atob(base64Data);
          const binaryArray = Array.from(binaryString, char => char.charCodeAt(0));
          const uint8Array = new Uint8Array(binaryArray);
          const binaryBlob = new Blob([uint8Array], { type: mimeType });

          positionData.value.user_picture_blob = binaryBlob;
        }
      };
    } catch (error) {
      console.error('Error resizing image:', error);
      sweetalertService.showAlertTimeOut('Image resize error', 'Failed to resize image.', 'error');
    }
  }
};



/**
 * ชื่อฟังก์ชัน (Name Fuction) : handleFormSubmit
 * ฟังก์ชันทำอะไร (What can the function do?) : ส่งข้อมูลฟอร์มไปยังเซิร์ฟเวอร์เพื่อเพิ่มข้อมูลบัญชีผู้ใช้ใหม่
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : ไม่มีการส่งค่า แต่ทำการรีไดเรกต์ (Redirect) ไปยังหน้ารายการบัญชีผู้ใช้ถ้าส่งข้อมูลสำเร็จ หรือแสดงข้อผิดพลาดถ้าไม่สำเร็จ
 */
const handleFormSubmit = async () => {
  try {
    const result = await sweetalertService.showAlert(
      t("sweetAdd.doYouWantToIncreaseData"),
      t("sweetAdd.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );

    if (result.isConfirmed) {
      try {
        const salt = bcrypt.genSaltSync(10); // Generate salt for bcrypt
        const hashedPassword = bcrypt.hashSync(positionData.value.user_password, salt); // Hash the password
        positionData.value.user_password = hashedPassword;

        const accessTokenCookie = useCookie('accessToken');
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value
        };
        const formData = new FormData();
        for (const key in positionData.value) {
          if (key !== 'user_picture_blob') {
            formData.append(key, positionData.value[key]);
          }
        }
        // Append Blob directly
        if (positionData.value.user_picture_blob) {
          formData.append('user_picture', positionData.value.user_picture_blob, 'user.png'); // Specify a filename if needed
        }

        await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/checkUsername/eec_users`, {
          data: positionData.value,
        }, { headers })
          .then(() => {
            sweetalertService.showSuccessTimeOut(
              t("sweetAdd.complete"),
              t("sweetAdd.dataAddedSuccessfully")
            );
            router.replace({ name: 'manage-account-account-list' });
          })
          .catch((err) => {
            if (err.response && err.response.status === 409) {
          console.log("1");
          sweetalertService.showErrorTimeOut("Error", "มีผู้ใช้งานนี้ไปแล้ว.");
          } else {
          console.log("2")
          console.log(error);
          sweetalertService.showErrorTimeOut("Error", "An error occurred.");
          }
          });
      } catch (error) {
        sweetalertService.showErrorTimeOut("Error", "An error occurred.")
      }
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetAdd.cancel"),
        t("sweetAdd.successfullyCanceledDataIncrease"),
        "error"
      );
    }
  } catch (error) {
    console.error("Error in handleFormSubmit:", error);
  }
};


/**
 * ชื่อฟังก์ชัน (Name Fuction) : resetAvatar
 * ฟังก์ชันทำอะไร (What can the function do?) : รีเซ็ตภาพอวาตาร์ของผู้ใช้กลับไปที่รูปเริ่มต้น
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */
// reset avatar image
const resetAvatar = () => {
  positionData.value.user_picture = userPicture;

}

const limitPhoneNumberLength = (event) => {
  const value = event.target.value;
  if (value.length > 10) {
    positionData.value.user_number_phone = value.slice(0, 10);
  }
};

</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <!-- 👉 Account Information -->
        <VCard class="mb-6" title="">
          <template v-slot:title>
            <div>
              <h3 class="font-weight-bold ">
                {{ $t('MangeAccount.formAccount.addAccount') }}
              </h3>
            </div>
          </template>

          <VCardText class="d-flex">
            <!-- 👉 Avatar -->
            <VAvatar rounded size="100" class="me-6" :image="positionData.user_picture" />

            <!-- 👉 Upload Photo -->
            <form class="d-flex flex-column justify-center gap-4">
              <div class="d-flex flex-wrap gap-4">
                <VBtn color="primary" size="small" @click="refInputEl?.click()">
                  <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">{{ $t('MangeAccount.formAccount.UploadNewPhoto') }}</span>

                </VBtn>


                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                  @input="changeAvatar">

                <!-- 👉 Reset photo -->
                <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
                  <span class="d-none d-sm-block">{{ $t('MangeAccount.formAccount.resetPhoto') }}</span>
                  <VIcon icon="tabler-refresh" class="d-sm-none" />
                </VBtn>
              </div>

              <p class="text-body-1 mb-0">
                {{ $t('MangeAccount.formAccount.imagesize') }}
              </p>
            </form>
          </VCardText>

          <!-- 👉 Form -->

          <VCardText>
            <VForm ref="refAccountForm" @submit.prevent="handleFormSubmit">
              <VRow>
                <VCol cols="12" md="6">
                  <AppTextField v-model="positionData.user_first_name" :label="t('MangeAccount.formAccount.firstname')"
                    :placeholder="t('MangeAccount.formAccount.firstname')" :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="positionData.user_last_name" :label="t('MangeAccount.formAccount.lastname')"
                    :placeholder="t('MangeAccount.formAccount.lastname')" :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppSelect :items="items" v-model="positionData.user_role" :label="t('MangeAccount.formAccount.role')"
                    :placeholder="t('MangeAccount.formAccount.role')" :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.user_number_phone"
                    :label="t('MangeAccount.formAccount.PhoneNumber')" placeholder="+1 123 456 7890" type="number"
                    :rules="[rules.required]" maxlength="10"  @input="limitPhoneNumberLength"/>
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.user_email" :label="t('MangeAccount.formAccount.Email')"
                    placeholder="john@email.com" :rules="[rules.required, rules.email]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="positionData.user_username" :label="t('MangeAccount.formAccount.Username')"
                    :placeholder="t('MangeAccount.formAccount.Username')" :rules="[value => !!value || $t('rule.require'),
                value => /^[a-zA-Z0-9]+$/.test(value) || $t('rule.alphabet')
                ]" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.user_password"
                    :append-inner-icon="showPassword1 ? 'tabler-eye' : 'tabler-eye-off'"
                    :label="t('MangeAccount.formAccount.Password')" :hint="t('MangeAccount.rules.rulesmin')"
                    placeholder="············" :rules="[rules.required, rules.min]"
                    :type="showPassword1 ? 'text' : 'password'" name="input-10-1" counter
                    @click:append-inner="showPassword1 = !showPassword1" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.confirmPassword"
                    :append-inner-icon="showPassword2 ? 'tabler-eye' : 'tabler-eye-off'"
                    :label="t('MangeAccount.formAccount.ConfirmPassword')" :hint="t('MangeAccount.rules.rulesmin')"
                    placeholder="············" :rules="[rules.required, rules.min, rules.matchPassword]"
                    :type="showPassword2 ? 'text' : 'password'" name="input-10-1" counter
                    @click:append-inner="showPassword2 = !showPassword2" />
                </VCol>

                <!-- 👉 Button Seve Accout Data -->
                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <VBtn type="submit">{{ $t('button.save') }}</VBtn>

                  <!-- 👉 Button Cancel -->
                  <VBtn color="secondary" variant="tonal" type="reset"
                    @click="$router.push({ name: 'manage-account-account-list' })">
                    {{ $t('button.cancel') }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>

</template>

<style lang="scss">
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}
</style>
