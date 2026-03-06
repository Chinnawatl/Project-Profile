//*********************************** */
// View: Edit Profile User
// Auther: Nareson Jiwbang
// Description : Edit Account User for Change Data
//*********************************** */
<script setup lang="js">
import avatar1 from '@images/avatars/avatar-1.png';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { VForm } from 'vuetify/components/VForm';
import { VCol } from 'vuetify/lib/components/index.mjs';
import sweetalertService from '../../../service/sweetalertService';
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// รูปภาพของผู้ใช้งาน
const accountData = {
  avatarImg: avatar1,
}
const dataProfile = ref([]);
const userDataCookie = useCookie('userData')
const id = userDataCookie.value.id

const role = userDataCookie.value.role

const getDataProfile = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_users/${id}`,
      // {
      //   where: {
      //     user_role: role,
      //   },
      //   populate: ["user_role"]
      // },
      {
        headers
      }
    );
    console.log("res get" + response);
    dataProfile.value = response.data;
    console.log("res set" + response.value)
  } catch (error) {
    console.log(error);
  }
};

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
  const maxFileSize = 800 * 1024; // 800 KB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']; // รองรับ PNG, JPG, GIF

  if (files && files.length) {
    const selectedFile = files[0];
    console.log(selectedFile.size / 1024)

    // ตรวจสอบประเภทของไฟล์
    if (!allowedTypes.includes(selectedFile.type)) {
      sweetalertService.showAlertTimeOut('File type error', 'Only PNG, JPG, and GIF files are allowed.', 'error');
      file.target.value = ''; // ลบไฟล์ที่เพิ่มเข้ามา
      return;
    }

    // ตรวจสอบขนาดของไฟล์
    if (selectedFile.size > maxFileSize) {
      sweetalertService.showAlertTimeOut('File size error', 'File size should be less than 800 KB.', 'error');
      file.target.value = ''; // ลบไฟล์ที่เพิ่มเข้ามา
      return;
    }

    try {
      // Resize the image to a maximum width and height (e.g., 800x800)
      const { blob: resizedBlob, mimeType } = await resizeImage(selectedFile, 800, 800);

      fileReader.readAsDataURL(resizedBlob);
      fileReader.onload = () => {
        const result = fileReader.result;
        if (typeof result === 'string') {
          dataProfile.value.user_picture = result;

          // Convert base64 to binary data
          const base64Data = result.split(',')[1];
          const binaryString = atob(base64Data);
          const binaryArray = Array.from(binaryString, char => char.charCodeAt(0));
          const uint8Array = new Uint8Array(binaryArray);
          const binaryBlob = new Blob([uint8Array], { type: mimeType });

          console.log(uint8Array); // Array of numbers representing binary data
          console.log(binaryBlob); // Blob object
          console.log(binaryBlob.size/1024); // Blob object

          // Save binaryBlob to dataProfile
          dataProfile.value.user_picture_blob = binaryBlob;
        }
      };
    } catch (error) {
      console.error('Error resizing image:', error);
      sweetalertService.showAlertTimeOut('Image resize error', 'Failed to resize image.', 'error');
    }
  }
};





const editProfile = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${id}`, {
      data: dataProfile.value
    }, {
      headers
    }
    );
    router.replace({ name: 'profile-manage-profile' });
  } catch (error) {
    console.log(error);
  }
}

// ฟอร์มสำหรับเก็บการแก้ไขข้อมูล
const AccountForm = ref({
  user_first_name: "",
  user_last_name: "",
  user_email: "",
  user_role: "",
  user_number_phone: "",
  user_username: "",
});


// เก็บข้อมูลที่แก้ไข
const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']
const accountDataLocal = ref(structuredClone(accountData))

const rules = {
  required: (value) => !!value || 'Required.',
  min: (v) => v.length >= 8 || 'Min 8 characters',
}



// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

// const resetForm = () => {
//   accountDataLocal.value = structuredClone(accountData)
// }

const deleteUser = async (item) => {
  try {
    const result = await sweetalertService.showAlert(
      t("sweetDelete.doYouWantToDeleteData"),
      t("sweetDelete.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    if (result.isConfirmed) {
      try {
        const accessTokenCookie = useCookie('accessToken')
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value
        }
        await axios
          .put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${id}`,
            {
              data: {
                user_status: 'Delete',
              },
            }, {
            headers
          })
          .then((result) => {
            router.replace({ name: 'login' });
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.log(error)
      }
      sweetalertService.showSuccessTimeOut(
        t("sweetDelete.complete"),
        t("sweetDelete.yourDataHasBeenSuccessfullyDeleted")
      );
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetDelete.cancel"),
        t("sweetDelete.successfullyCanceledDataDelete"),
        "error"
      );
    }
  } catch (error) {
    sweetalertService.showErrorTimeOut("Error", "An error occurred.");
  }
};

onMounted(() => {
  console.log("pull id" + id.value)
  getDataProfile();
})
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
                {{ $t("headerEditProfile") }}
              </h3>
            </div>
          </template>

          <VCardText class="d-flex">
            <!-- 👉 Avatar -->
            <VAvatar rounded size="100" class="me-6" :image="dataProfile.user_picture" />

            <!-- 👉 Upload Photo -->
            <form class="d-flex flex-column justify-center gap-4">
              <div class="d-flex flex-wrap gap-4">
                <VBtn color="primary" size="small" @click="refInputEl?.click()">
                  <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">{{ $t("Edit.buttonUpload") }}</span>

                </VBtn>

                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                  @input="changeAvatar">

                <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
                  <span class="d-none d-sm-block">{{ $t("Edit.buttonReset") }}</span>
                  <VIcon icon="tabler-refresh" class="d-sm-none" />
                </VBtn>
              </div>

              <p class="text-body-1 mb-0">
                {{ $t("Edit.sideForUploadImage") }}
              </p>
            </form>
          </VCardText>

          <VCardText>
            <VForm ref="refAccountForm" @submit.prevent="">
              <VRow>
                <VCol cols="12" md="6">
                  <AppTextField v-model="dataProfile.user_first_name" :label="$t('Edit.firstName')"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="dataProfile.user_last_name" :label="$t('Edit.lastName')"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="dataProfile.user_number_phone" :label="$t('Edit.phoneNumber')" type="number"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="dataProfile.user_email" :label="$t('Edit.Email')"
                    :rules="[requiredValidator, emailValidator]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="dataProfile.user_username" :label="$t('Edit.Username')"
                    :rules="[requiredValidator]" />
                </VCol>


                <!-- <VCol>
                <span class="mb-1">Description (optional)</span>
                <ProductDescriptionEditor v-model="content" placeholder="Product Description" class="border rounded" />
                </VCol> -->
                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <VBtn type="submit" @click="editProfile()"> {{ $t("Edit.buttonSave") }} </VBtn>
                  <VBtn color="secondary" variant="tonal" type="reset" @click="$router.push('/Manage/Profile')">
                    {{ $t("Edit.buttonCancel") }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
        <!-- 👉 Delete Account -->
        <VCard :title="$t('Delete.headerDelete')" class="mb-6">
          <VCardText>
            <!-- 👉 Checkbox and Button  -->
            <div>
              <VCheckbox v-model="isAccountDeactivated" :rules="validateAccountDeactivation"
                :label="$t('Delete.confirm')" />
            </div>

            <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-6" @click="deleteUser()">
              {{ $t("Delete.buttonDeactivate") }}
            </VBtn>

          </VCardText>
        </VCard>

      </VCol>

    </VRow>
  </div>
  <!-- Confirm Dialog -->
  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogOpen"
    confirmation-question="Are you sure you want to deactivate your account?" confirm-title="Deactivated!"
    confirm-msg="Your account has been deactivated successfully." cancel-title="Cancelled"
    cancel-msg="Account Deactivation Cancelled!" />
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
