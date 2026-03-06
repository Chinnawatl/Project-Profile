/*
* file name : viewaccount
* What is it used for : View account information to the system
* Author : Chinnawat Leekpai
* Create date :21 June 2024
*/

<script setup lang="js">
import { VForm } from 'vuetify/components/VForm'
import avatar1 from '@images/avatars/avatar-1.png'
import { VCol } from 'vuetify/lib/components/index.mjs';
import { ref, onMounted } from "vue";
import axios from 'axios';
import sweetalertService from '../../../service/sweetalertService';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// const route = useRoute('manage-account-viewaccount')


const refInputEl = ref()
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || t('MangeAccount.formAccount.PleaseConfirmdeleteAccount')]
const router = useRouter();
const route = useRoute(); // Add this line to get the route object
// const userId = route.params.id;

const items = [
  { title: "Super Admin", value: "66822fcb46d6914e3d7d9c43" },
  { title: "Admin System", value: "6684f800fc9847e2ec4d1dfc" },
  { title: "User", value: "66861983f74f22f8a7f40dc4" },
  { title: "External", value: "66861995f74f22f8a7f40dc6" },
  { title: "Dev", value: "6699e3050009dae6f4ac5ea6" },
];

const positionData = ref({
  user_first_name: '',
  user_last_name: '',
  user_number_phone: '',
  user_email: '',
  user_role: '',
  user_status: '',
  user_username: '',
  _id: '',
  user_picture: '',
});

/**
 * ชื่อฟังก์ชัน (Name Function) : getPositionEdit
 * ฟังก์ชันทำอะไร (What can the function do?) : ดึงข้อมูลของผู้ใช้จาก API โดยใช้ ID ที่ระบุและเก็บข้อมูลลงในตัวแปร positionData
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */

const id = ref(route.params.id);
const getPositionEdit = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value,
    };
    await axios
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/getone/eec_users/${id.value}`, { headers },)
      .then((result) => {
        console.log(result);
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
          positionData.value.user_picture = avatar1; // กำหนดให้เป็น avatar1 หากไม่มี user_picture
        }

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
});

const rules = {
  required: (value) => !!value || 'Required.',
  min: (v) => v.length >= 8 || 'Min 8 characters',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
}

// const changeAvatar = file => {
//   const fileReader = new FileReader()
//   const { files } = file.target
//   if (files && files.length) {
//     fileReader.readAsDataURL(files[0])
//     fileReader.onload = () => {
//       if (typeof fileReader.result === 'string')
//         accountDataLocal.value.avatarImg = fileReader.result
//     }
//   }
// }

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
      try {
        const accessTokenCookie = useCookie('accessToken');
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value,
        };
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
    sweetalertService.showErrorTimeOut("Error", "An error occurred.");
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
                <VBtn :disabled="true" color="primary" size="small" @click="refInputEl?.click()">
                  <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">{{ $t('MangeAccount.formAccount.UploadNewPhoto') }}</span>
                </VBtn>
              </div>
              <p class="text-body-1 mb-0">
                {{ $t('MangeAccount.formAccount.imagesize') }}
              </p>
            </form>
          </VCardText>

          <!-- 👉 View Form Account Data -->
          <VCardText>
            <VForm ref="refAccountForm" @submit.prevent="">
              <VRow>
                <VCol cols="12" md="6">
                  <!-- Order #{{ route.params.name }} -->
                  <AppTextField v-model="positionData.user_first_name" :label="t('MangeAccount.formAccount.firstname')" disabled
                    :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="positionData.user_last_name" :label="t('MangeAccount.formAccount.lastname')" disabled
                    :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppSelect :items="items" v-model="positionData.user_role" :label="t('MangeAccount.formAccount.role')" disabled
                    :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.user_number_phone" :label="t('MangeAccount.formAccount.PhoneNumber')" type="number" disabled
                    :rules="[rules.required]" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="positionData.user_email" :label="t('MangeAccount.formAccount.Email')" disabled
                    :rules="[rules.required, rules.email]" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="positionData.user_username" :label="t('MangeAccount.formAccount.Username')" disabled
                    :rules="[rules.required]" />
                </VCol>

                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <!-- <VBtn type="submit">Save changes</VBtn> -->

                  <!-- 👉ฺ Button Cancel  -->
                  <VBtn color="secondary" variant="tonal" type="reset"
                    @click="$router.push({ name: 'manage-account-account-list' })">
                    {{ $t('button.cancel') }}
                  </VBtn>
                  <!-- <VBtn type="submit">แก้ไข</VBtn> -->

                </VCol>
              </VRow>
            </VForm>
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
