//*********************************** */
// View: Profile User
// Auther: Nareson Jiwbang
// Description : Show Data Profile User, User Can Edit and Delete Owner Account
//*********************************** */
<script setup lang="js">
import eecLogo from "@images/eecImages/logoEEC.png";
import axios from 'axios';
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import sweetalertService from '../../../service/sweetalertService';
import { useI18n } from 'vue-i18n';
const accessTokenCookie = useCookie('accessToken')
const userDataCookie = useCookie('userData')
const id = userDataCookie.value.id
const role = userDataCookie.value.role
const router = useRouter();
const { t } = useI18n();
const getDataUser = ref([]);
const status_user = ref([])

//ข้อมูลสำหรับแสดงในตารางประวัติการอบรม
const educateHistory = ref([
]);

const workHistory = ref([
]);

const getUser = async () => {
  try {
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }

    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_users/${id}`,
      {
        where: {
          user_role: role,
        },
        populate: ["user_role"]
      },
      {
        headers
      }
    );
    getDataUser.value = result.data;
  } catch (error) {
    console.error(error);
  }
};

const getEducateHistory = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')

    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_history_training`,
    {
      where: {
        htn_user: id,
      },
      populate: ["tra_id_course"]
    },
       { headers });
    educateHistory.value = result.data;
    console.log("adqdqqee",educateHistory.value)
  } catch (error) {
    console.log(error);
  }
};

const getWorkHistory = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };

    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_jobs`, 
    {
      where: {
        _id: id,
      }
    }, 
    { headers }); // ใส่ headers ในพารามิเตอร์ที่สามของ axios.post

    workHistory.value = result.data;
  } catch (error) {
    console.log(error);
  }
};


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

//หัวตารางของประวัติการอบรม
const headersEducate = [
  { title: t("historyEducate.nameCouse"), value: "tra_id_course.typb_name_course", },
  { title: t("historyEducate.Location"), value: "tra_id_course.typb_academy" },
  { title: t("historyEducate.Owner"), value: "tra_id_course.CREATED_BY" },
  { title: t("historyEducate.Detail"), value: "action" },
];

//แสดงข้อมูลแค่ 5 แถว
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const editPageProfile = (id) => {
  console.log("id" + " " + id)
  const headers = {
    "Authorization": "Bearer " + accessTokenCookie.value
  }
  router.push({
    name: "profile-edit-profile",
    params: {
      id: id
    }
  })
};

//หัวตารางประวัติการทำงาน
const headersWork = [
  { title: t("historyWork.Position"), value: "job_name" },
  { title: t("historyWork.Company"), value: "job_company" },
  { title: t("historyWork.Skill"), value: "job_skill_set" },
  { title: t("historyWork.Detail"), value: "action", align: 'center' },
];



//ฟังชันก์สำหรับการเปิดปิดมอดอลดูรายละเอียดและแก้ไข
const isEditDialogOpen = ref(false);
const isDetailDialogOpenEducate = ref(false);
const selectedCourse = ref(null);
const isDetailDialogOpenWork = ref(false);

//ฟังก์ชันเปิดมอดอลสำหรับแก้ไขข้อมูล
const openEditDialog = () => {
  isEditDialogOpen.value = true;
};

//ฟังก์ชันสำหรับการปิดมอดอลแก้ไขข้อมูล
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};

//ฟังก์ชันสำหรับบันทึกข้อมูลเมื่อแก้ไขเสร็จ
const saveChanges = () => {
  // Logic for saving changes
  closeEditDialog();
};

//ฟังก์ชันเปิดมอดอลสำหรับดูรายละเอียดประวัติการอบรม
const openDetailDialogEducate = (item) => {
  selectedCourse.value = item;
  isDetailDialogOpenEducate.value = true;
};

//ฟังก์ชันเปิดมอดอลสำหรับดูรายละเอียดประวัติการทำงาน
const openDetailDialogWork = (item) => {
  selectedCourse.value = item;
  isDetailDialogOpenWork.value = true;
}

//ฟังก์ชันเปิดมอดอลสำหรับปิดดูรายละเอียด
const closeDetailDialog = () => {
  isDetailDialogOpenEducate.value = false;
  selectedCourse.value = null;
};

//ฟังก์ชันเปิดมอดอลสำหรับปิดดูรายละเอียด
const closeDetailDialogWork = () => {
  isDetailDialogOpenWork.value = false;
  selectedCourse.value = null;
};

onMounted(() => {
  getUser();
  getEducateHistory();
  getWorkHistory();
});

</script>

<template>
  <VRow>
    <!-- โปรไฟล์ผู้ใช้งาน -->
    <VCol col="12" md="4">
      <VCard>
        <VCardText class="d-flex flex-column justify-center align-center">
          <VImg :src="getDataUser.user_picture" class="borderImage" />
          <!-- <VImg :src="getDataUser.user_picture" class="responsive-img" height="130" /> -->
          <VCardText>
            <p>{{ getDataUser.user_first_name }} {{ getDataUser.user_last_name }}</p>
          </VCardText>
          <VChip color="light-secondary">
            <VCardText v-if="getDataUser.user_role && getDataUser.user_role.rol_name">{{
              getDataUser.user_role.rol_name }}</VCardText> <!-- Conditional display -->
            <VCardText v-else>Data Not Defind</VCardText> <!-- Fallback message -->
          </VChip>
        </VCardText>
        <VCardText>
          <p>{{ $t("historyEducate.Detail") }}</p>
          <hr>
        </VCardText>
        <VCardText>
          <p>{{ $t("dataProfile.Username") + ": " }} {{ getDataUser.user_username }}</p>
          <p>{{ $t("dataProfile.Email") + ": " }} {{ getDataUser.user_email }}</p>
          <p>{{ $t("dataProfile.Status") + ": " }} {{ getDataUser.user_status }}</p>
          <p>{{ $t("dataProfile.Context") + ": " }} {{ getDataUser.user_number_phone }}</p>
          <p>{{ $t("dataProfile.Address") + ": " }} {{ getDataUser.user_address }}</p>
        </VCardText>
        <VCardText class="d-flex justify-center align-center gap-4">
          <VBtn @click="editPageProfile(getDataUser._id)">{{ $t("dataProfile.buttonEdit") }}</VBtn>
          <VBtn color="error" @click="deleteUser(item)">{{ $t("dataProfile.buttonDelete") }}</VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <VCol col="12" md="8">
      <!-- ประวัติการฝึกอบรม -->
      <VRow>
        <VCardText>
          <VCard>
            <VCardText>
              <h2> {{ $t("historyEducate.headerHisEdu") }} </h2>
              <VDataTable :headers="headersEducate" :items="educateHistory" :items-per-page="options.itemsPerPage"
                :page.sync="options.page">
                <template #bottom>

                </template>
                <template #item.action="{ item }">
                  <div class="d-flex justify-center align-center">
                    <VBtn icon @click="openDetailDialogEducate(item)">
                      <VIcon icon="tabler-eye" />
                    </VBtn>
                  </div>
                </template>
              </VDataTable>
            </VCardText>
          </VCard>
        </VCardText>
      </VRow>
      <!-- ประวัติการทำงาน -->
      <VRow>
        <VCardText>
          <VCard>
            <VCardText>
              <h2> {{ $t("historyWork.headerHisWork") }} </h2>
              <VDataTable :headers="headersWork" :items="workHistory" :items-per-page="options.itemsPerPage"
                :page.sync="options.page">
                <template #bottom>

                </template>
                <template #item.job_skill_set="{ item }">
                  <div>
                    <VChip v-for="(skill, index) in item.job_skill_set" :key="index" class="ma-1">
                      {{ skill }}
                    </VChip>
                  </div>
                </template>
                <template #item.action="{ item }">
                  <div class="d-flex justify-center align-center">
                    <VBtn icon @click="openDetailDialogWork(item)">
                      <VIcon icon="tabler-eye" />
                    </VBtn>
                  </div>
                </template>
              </VDataTable>
            </VCardText>
          </VCard>
        </VCardText>
      </VRow>
    </VCol>
  </VRow>


  <!-- มอดอลดูรายละเอียดประวัติการอบรม -->
  <VDialog v-model="isDetailDialogOpenEducate" max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="headline">{{ $t("historyEducate.headerHisEdu") }}</span>
      </VCardTitle>
      <VCardText>
        <p><strong> {{ $t("historyEducate.nameCouse") + ": " }} </strong> {{
          selectedCourse?.tra_id_course.typb_name_course
        }}</p>
        <p><strong>{{ $t("historyEducate.Location") + ": " }} </strong> {{ selectedCourse?.tra_id_course.typb_academy }}
        </p>
        <p><strong>{{ $t("historyEducate.Owner") + ": " }}</strong> {{ selectedCourse?.tra_id_course.CREATED_BY }}</p>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="blue darken-1" text @click="closeDetailDialog">ปิด</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- มอดอลดูรายละเอียดประวัติการทำงาน -->
  <VDialog v-model="isDetailDialogOpenWork" max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="headline">{{ $t("historyWork.headerHisWork") }}</span>
      </VCardTitle>
      <VCardText>
        <p><strong> {{ $t("historyWork.Position") + ":" }} </strong> {{ selectedCourse?.job_name }}</p>
        <p><strong>{{ $t("historyWork.Company") + ": " }} </strong> {{ selectedCourse?.job_company }}</p>
        <p><strong>{{ $t("historyWork.Skill") + ": " }} </strong>
          <VChip v-for="(skill, index) in selectedCourse?.job_skill_set" :key="index" class="ma-1">
            {{ skill }}
          </VChip>
        </p>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="blue darken-1" text @click="closeDetailDialogWork">ปิด</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

//css
<style lang="scss">
.spaceBetweenBox {
  //ช่องว่างระหว่งบรรทัดในมอดอล
  margin: 1rem;
}

.borderImage {
  border-radius: 5px;
  width: 50%;
  height: 50%;
}
</style>
