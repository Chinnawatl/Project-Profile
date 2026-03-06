/*
* file name : editAccount
* What is it used for : edit account information to the system
* Author : Chinnawat Leekpai
* Create date : 20 June 2024
*/

<script setup lang="js">

import { VForm } from 'vuetify/components/VForm'
import avatar1 from '@images/avatars/avatar-1.png'
import userPicture from '@images/eecImages/user.png';
import { VCol } from 'vuetify/lib/components/index.mjs';
import { ref, onMounted } from "vue";
import sweetalertService from '../../../service/sweetalertService';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import bcrypt from "bcryptjs";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();


const positionData = ref({
  user_first_name: '',
  user_last_name: '',
  user_number_phone: '',
  user_email: '',
  user_role: '',
  user_status: 'Activate',
  user_username: '',
  user_picture: ref([]),
});

const passwordData = ref({
  user_password: '',
});

const items = [
  { title: "Super Admin", value: "66822fcb46d6914e3d7d9c43" },
  { title: "Admin System", value: "6684f800fc9847e2ec4d1dfc" },
  { title: "User", value: "66861983f74f22f8a7f40dc4" },
  { title: "External", value: "66861995f74f22f8a7f40dc6" },
  { title: "Dev", value: "6699e3050009dae6f4ac5ea6" },
];

const refInputEl = ref()
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || t('MangeAccount.formAccount.PleaseConfirmdeleteAccount')]
const refAccountForm = ref()
const router = useRouter();
const route = useRoute();
const showPassword1 = ref(true)
const showPassword2 = ref(true)


/**
 * ชื่อฟังก์ชัน (Name Function) : getPositionEdit
 * ฟังก์ชันทำอะไร (What can the function do?) : ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์โดยใช้ ID ที่ได้มาจาก route และนำข้อมูลนั้นมาใส่ใน `positionData`
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */

const id = ref(route.params.id);
const getPositionEdit = async () => {

  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/getone/eec_users/${id.value}`, { headers },)
      .then((result) => {
        positionData.value.user_first_name = result.data.user_first_name;
        positionData.value.user_last_name = result.data.user_last_name;
        positionData.value.user_number_phone = result.data.user_number_phone;
        positionData.value.user_email = result.data.user_email;
        positionData.value.user_role = result.data.user_role;
        positionData.value.user_username = result.data.user_username;
        positionData.value._id = result.data._id;
        if (result.data.user_picture) {
          positionData.value.user_picture = result.data.user_picture;
        } else {
          positionData.value.user_picture = avatar1; // กำหนดให้เป็น avatar1 หากไม่มีข้อมูลใน user_picture
        }
        // console.log(result.data.user_picture);
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }
};

/**
 * ชื่อฟังก์ชัน (Name Function) : onMounted
 * ฟังก์ชันทำอะไร (What can the function do?) : ทำงานเมื่อคอมโพเนนต์ถูกเมานต์ ใช้ในการเรียก `getPositionEdit` พร้อมกับ ID ที่ได้มาจาก route
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */

onMounted(async () => {
  if (id) {
    await getPositionEdit();
  } else {
    console.error('ID not found in route params');
  }
})

const rules = {
  required: (value) => !!value || t('MangeAccount.rules.Required'),
  min: (v) => v.length >= 8 || t('MangeAccount.rules.min'),
  email: (value) => /.+@.+\..+/.test(value) || t('MangeAccount.rules.rulesemail'),
  matchPassword: (value) => value === passwordData.value.user_password || t('MangeAccount.rules.matchPassword'),
  maxSize: (value, size) => {
    if (value && value[0] && value[0].size > size) {
      return `File size should be less than ${size / 1024 / 1024} MB.`;
    }
    return true;
  },
}

/**
 * ชื่อฟังก์ชัน (Name Function) : changeAvatar
 * ฟังก์ชันทำอะไร (What can the function do?) : อัปเดตรูปภาพของผู้ใช้เมื่อมีการเปลี่ยนแปลงไฟล์ที่อัปโหลด
 * มีค่าอะไรบ้าง (param) : file - ออบเจกต์ไฟล์ที่ถูกเลือกโดยผู้ใช้
 * ส่งค่าอะไร (Return) : None
 */

 const resizeImage = (file, maxWidth, maxHeight, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // คำนวณขนาดที่ต้องการ
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

      // Convert image to JPG if it's a PNG
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
  const maxFileSize = 2048 * 1024; // 800 KB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']; // รองรับ PNG, JPG, GIF

  if (files && files.length) {
    const selectedFile = files[0];
    console.log(selectedFile.size / 1024)

    // ตรวจสอบประเภทของไฟล์
    if (!allowedTypes.includes(selectedFile.type)) {
      sweetalertService.showAlertTimeOut('File type error', 'Only PNG, JPG, and GIF files are allowed.', 'error');
      return;
    }

    // ตรวจสอบขนาดของไฟล์
    if (selectedFile.size > maxFileSize) {
      sweetalertService.showAlertTimeOut('File size error', 'File size should be less than 800 KB.', 'error');
      return;
    }

    try {
      // Resize the image to a maximum width and height (e.g., 800x800)
      const { blob: resizedBlob, mimeType } = await resizeImage(selectedFile, 800, 800);

      fileReader.readAsDataURL(resizedBlob);
      fileReader.onload = () => {
        const result = fileReader.result;
        if (typeof result === 'string') {
          positionData.value.user_picture = result;

          // Convert base64 to binary data
          const base64Data = result.split(',')[1];
          const binaryString = atob(base64Data);
          const binaryArray = Array.from(binaryString, char => char.charCodeAt(0));
          const uint8Array = new Uint8Array(binaryArray);
          const binaryBlob = new Blob([uint8Array], { type: mimeType });

          console.log(uint8Array); // Array of numbers representing binary data
          console.log(binaryBlob); // Blob object
          console.log(binaryBlob.size/1024); // Blob object

          // Save binaryBlob to positionData
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
 * ชื่อฟังก์ชัน (Name Function) : resetAvatar
 * ฟังก์ชันทำอะไร (What can the function do?) : รีเซ็ตรูปภาพของผู้ใช้ให้กลับไปเป็นรูปภาพเริ่มต้น (avatar1)
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */
// reset avatar image
const resetAvatar = () => {
  positionData.value.user_picture = userPicture;
}

/**
 * ชื่อฟังก์ชัน (Name Function) : deleteAccount
 * ฟังก์ชันทำอะไร (What can the function do?) : ลบบัญชีผู้ใช้หลังจากผู้ใช้ยืนยันการลบ
 * มีค่าอะไรบ้าง (param) : item - ID ของผู้ใช้ที่ต้องการลบ
 * ส่งค่าอะไร (Return) : None
 */
const deleteAccouont = async (item) => {
  try {
    const result = await sweetalertService.showAlert(
      t("sweetDelete.doYouWantToDeleteData"),
      t("sweetDelete.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    if (result.isConfirmed) {
      const accessTokenCookie = useCookie('accessToken');
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      };
      try {
        await axios
          .put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${item}`, {
            data: {
              user_status: 'Delete',
            },
          }, { headers },);
        sweetalertService.showSuccessTimeOut(
          t("sweetDelete.complete"),
          t("sweetDelete.yourDataHasBeenSuccessfullyDeleted")
        );
        router.push({ name: 'manage-account-account-list' });
      } catch (error) {
        console.log(error);
      }
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetDelete.cancel"),
        t("sweetDelete.successfullyCanceledDataDelete"),
        "error"
      );
    }
  } catch (error) {
    sweetalertService.showErrorTimeOut("Error", "An error occurred");
  }
};

/**
 * ชื่อฟังก์ชัน (Name Function) : handleFormSubmit
 * ฟังก์ชันทำอะไร (What can the function do?) : อัปเดตข้อมูลผู้ใช้ในฐานข้อมูลเมื่อมีการส่งฟอร์ม
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */
const handleFormSubmit = async () => {
  try {
    const result = await sweetalertService.showAlert(
      t("sweetEdit.doyouWantToModifyData"),
      t("sweetEdit.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    if (result.isConfirmed) {
      try {
        const accessTokenCookie = useCookie('accessToken')
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value
        };

        const formData = new FormData();
        for (const key in positionData.value) {
          if (key !== 'user_picture_blob') {
            formData.append(key, positionData.value[key]);
          }
        }
        if (positionData.value.user_picture_blob) {
          formData.append('user_picture', positionData.value.user_picture_blob);
        }

        await axios
          .put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${id.value}`, {
            data: positionData.value,
          }, { headers },)
          .then((result) => {
            sweetalertService.showSuccessTimeOut(
              t("sweetEdit.complete"),
              t("sweetEdit.yourDataHasBeenSuccessfullyModifies")
            );
            router.replace({ name: 'manage-account-account-list' });
          })
          .catch((err) => {
            console.log(err)
            sweetalertService.showErrorTimeOut("Error", "The file is larger than 800KB. Please select an image.");
          })
      } catch (error) {
        console.log(error)
        sweetalertService.showErrorTimeOut("Error", "An error occurred");
      }
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetEdit.cancel"),
        t("sweetEdit.successfullyCanceledDataIncrease"),
        "error"
      );
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * ชื่อฟังก์ชัน (Name Function) : changePassword
 * ฟังก์ชันทำอะไร (What can the function do?) : อัปเดตข้อมูลรหัสผ่านผู้ใช้ในฐานข้อมูลเมื่อมีการส่งฟอร์ม
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */
const changePassword = async () => {
  try {
    const result = await sweetalertService.showAlert(
      t("sweetEdit.doyouWantToModifyData"),
      t("sweetEdit.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    if (result.isConfirmed) {
      const salt = bcrypt.genSaltSync(10); // Generate salt for bcrypt
      const hashedPassword = bcrypt.hashSync(passwordData.value.user_password, salt); // Hash the password
      const accessTokenCookie = useCookie('accessToken');
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      };

      await axios
        .put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${id.value}`, {
          data: {
            user_password: hashedPassword,
          },
        }, { headers },)
        .then((result) => {
          sweetalertService.showSuccessTimeOut("Success", "Password changed successfully");
        })
        .catch((err) => {
          console.log(err);
          sweetalertService.showErrorTimeOut("Error", "Failed to change password");
        });
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetEdit.cancel"),
        t("sweetEdit.successfullyCanceledDataModify"),
        "error"
      );
    }
  } catch (error) {
    console.log(error);
    sweetalertService.showErrorTimeOut("Error", "An error occurred");
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
                {{ $t('MangeAccount.formAccount.editAccount') }}
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
                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,.gif" hidden @input="changeAvatar" :rules="[rules.maxSize]">
                <!-- 👉 Reset Photo -->
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

          <!-- 👉 Form Account -->
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
                    :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.user_email" :label="t('MangeAccount.formAccount.Email')"
                    placeholder="john@email.com" :rules="[rules.required, rules.email]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="positionData.user_username" :label="t('MangeAccount.formAccount.Username')"
                    :placeholder="t('MangeAccount.formAccount.Username')" :rules="[rules.required]" disabled />
                </VCol>
                <!-- 👉 Seve Account -->
                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <VBtn type="submit">{{ $t('button.save') }}</VBtn>

                  <!-- 👉 Cancel Account -->
                  <VBtn color="secondary" variant="tonal" type="reset"
                    @click="$router.push({ name: 'manage-account-account-list' })">
                    {{ $t('button.cancel') }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>

        <!-- 👉 change Password -->
        <VCard :title="t('MangeAccount.formAccount.changePassword')" class="mb-6">
          <VCardText>
            <form @submit.prevent="changePassword">
              <VRow>
                <VCol cols="12" md="6">
                  <AppTextField v-model="passwordData.user_password"
                    :append-inner-icon="showPassword1 ? 'tabler-eye' : 'tabler-eye-off'"
                    :label="t('MangeAccount.formAccount.Password')" :hint="t('MangeAccount.rules.rulesmin')"
                    placeholder="············" :rules="[rules.required, rules.min]"
                    :type="showPassword1 ? 'text' : 'password'" name="input-10-1" counter
                    @click:append-inner="showPassword1 = !showPassword1" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="passwordData.ConfirmPassword"
                    :append-inner-icon="showPassword2 ? 'tabler-eye' : 'tabler-eye-off'"
                    :label="t('MangeAccount.formAccount.ConfirmPassword')" :hint="t('MangeAccount.rules.rulesmin')"
                    placeholder="············" :rules="[rules.required, rules.min, rules.matchPassword]"
                    :type="showPassword2 ? 'text' : 'password'" name="input-10-1" counter
                    @click:append-inner="showPassword2 = !showPassword2" />
                </VCol>
                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <VBtn type="submit"> {{ $t('button.changesPassword') }}</VBtn>
                </VCol>
              </VRow>
            </form>
          </VCardText>
        </VCard>

        <!-- 👉 Delete Account -->
        <VCard :title="t('MangeAccount.formAccount.deleteAccount')" class="mb-6">
          <VCardText>
            <!-- 👉 Checkbox and Button  -->
            <div>
              <VCheckbox v-model="isAccountDeactivated" :rules="validateAccountDeactivation"
                :label="t('MangeAccount.formAccount.ConfirmdeleteAccount')" />
            </div>
            <!-- 👉  Button Delete Account -->
            <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-6"
              @click="deleteAccouont(positionData._id)">
              {{ $t('button.deleteData') }}
            </VBtn>

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
