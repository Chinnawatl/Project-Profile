<template>
  <div>
    <VCard>
      <template v-slot:title>
        <div class="d-flex">
          <h3>
            {{ $t('manageTraining.title') }}
          </h3>
        </div>
      </template>
      <hr />
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <AppTextField :label="$t('manageTraining.search')" v-model="search"
              :placeholder="$t('manageTraining.placeholdersearch')" prepend-inner-icon="tabler-search" single-line
              hide-details dense outlined />
          </VCol>
          <VCol cols="12" md="2">
            <AppAutocomplete :label="$t('manageTraining.status')" @update:model-value="handleUpdate"
              v-model="selectedStatus" :items="statusItem" :placeholder="$t('manageTraining.placeholderstatus')" />
          </VCol>
          <VCol cols="12" md="2">
            <div class="container">
              <span class="required-text">{{ $t('manageTraining.required') }}</span>
            </div>
            <!-- <span style="justify-content: center; color: red;">{{ $t('manageTraining.required') }}</span> -->
          </VCol>
          <VCol cols="12" md="7" offset-md="5" class="text-right">
            <VBtn color="info" @click="addFormEB02">
              <!-- เพิ่มข้อมูล -->
              {{ $t('manageTraining.buttonAdd') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <hr />
      <VDataTable :no-data-text="$t('manageTraining.noData')" :headers="headersTable" :search="search"
        :items="dataTable" :items-per-page="options.itemsPerPage" :page="options.page" :options="options">
        <template #bottom>
          <hr />
          <VCardText class="pt-2">
            <div class="footer-paginate">
              <span>{{ $t("manageTraining.table.amount") }}</span>

              <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
                style="max-width: 4vw" class="ms-2 me-2" />
              <span class="me-2">{{ $t("manageTraining.table.rowPerPage") }}</span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 1 : 3"
                :length="Math.ceil(dataTable.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
        <template #item.CREATED_AT="{ item }">
          {{ formatISODate(item.CREATED_AT) }}
        </template>
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.tra_status_approve).color" size="small">
            {{ resolveStatusVariant(item.tra_status_approve).text }}
          </VChip>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex">
            <IconBtn @click="editFormEB02(item._id)">
              <VIcon icon="tabler-edit" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ $t("manageTraining.tooltip.edit") }}</span>
              </VTooltip>
            </IconBtn>
            <IconBtn @click="formEB03(item._id)">
              <VIcon icon="tabler-report" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ $t("manageTraining.tooltip.eb03") }}</span>
              </VTooltip>
            </IconBtn>
            <IconBtn @click="formEB04(item._id)">
              <VIcon icon="tabler-certificate" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ $t("manageTraining.tooltip.eb04") }}</span>
              </VTooltip>
            </IconBtn>
            <IconBtn>
              <VIcon @click="deleteCourse" icon="tabler-trash" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ $t("manageTraining.tooltip.delete") }}</span>
              </VTooltip>
            </IconBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>


<script setup>
import { router } from "@/plugins/1.router";
import axios from "axios";
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import sweetalertService from '../../../service/sweetalertService';
const { t } = useI18n();
const accessTokenCookie = useCookie('accessToken')

const headers = {
  "Authorization": "Bearer " + accessTokenCookie.value
}
onMounted(async () => {

  // getTrainingData()
})
const search = ref("");
const statusItem = computed(() => [t("manageTraining.filter.All"), t("manageTraining.filter.Pending"), t("manageTraining.filter.Approved"), t("manageTraining.filter.Not Approved"), t("manageTraining.filter.Training Completed"), t("manageTraining.filter.Waiting Summary Report"), t("manageTraining.filter.Training Completed")]);

const selectedStatus = ref();
// const headersTable = [
//   { title: "ชื่อหลักสูตร", key: "tra_id_course.typb_name_course" },
//   // { title: "ชื่อหลักสูตร", key: "nameCourse" },
//   { title: "ชื่อผู้เสนอ", key: "tra_created_by.user_first_name" },
//   { title: "วันที่เสนอ", key: "CREATED_AT" },
//   { title: "สถานะ", key: "status" },
//   { title: "ดำเนินการ", key: "action" },
// ];


const headersTable = computed(() => [
  // { title: "ชื่องาน", key: "nameTask" },
  { title: t("manageTraining.table.typb_name_course"), key: "tra_id_course.typb_name_course" },
  { title: t("manageTraining.table.typb_created_by"), key: "tra_created_by.user_first_name" },
  { title: t("manageTraining.table.CREATED_AT"), key: "CREATED_AT" },
  { title: t("manageTraining.table.typb_status_approve"), key: "status" },
  { title: t("manageTraining.table.action"), key: "action" },
]);
const dataTable = ref([])

// const dataTable = ref([
//   {
//     nameTask: "EB02 - แบบฟอร์มขออนุมัติอบรม",
//     nameCourse: "หลักสูตร xxxxx",
//     createdBy: "admin",
//     createdAt: "14 มิถุนายน 2567",
//     status: 1

//   },
//   {
//     nameTask: "EB02 - แบบฟอร์มขออนุมัติอบรม",
//     nameCourse: "หลักสูตร xxxxx",
//     createdBy: "admin",
//     createdAt: "14 มิถุนายน 2567",
//     status: 2

//   },
//   {
//     nameTask: "EB02 - แบบฟอร์มขออนุมัติอบรม",
//     nameCourse: "หลักสูตร xxxxx",
//     createdBy: "admin",
//     createdAt: "14 มิถุนายน 2567",
//     status: 3

//   },
//   {
//     nameTask: "EB02 - แบบฟอร์มขออนุมัติอบรม",
//     nameCourse: "หลักสูตร xxxxx",
//     createdBy: "admin",
//     createdAt: "14 มิถุนายน 2567",
//     status: 4

//   },
//   {
//     nameTask: "EB02 - แบบฟอร์มขออนุมัติอบรม",
//     nameCourse: "หลักสูตร xxxxx",
//     createdBy: "admin",
//     createdAt: "14 มิถุนายน 2567",
//     status: 5

//   },
//   {
//     nameTask: "EB02 - แบบฟอร์มขออนุมัติอบรม",
//     nameCourse: "หลักสูตร xxxxx",
//     createdBy: "admin",
//     createdAt: "14 มิถุนายน 2567",
//     status: 6

//   },
// ]);
function handleUpdate(value) {
  selectedStatus.value = value
  getTrainingData()
}
async function getTrainingData() {
  console.log("test")
  try {
    let data = {}
    if (selectedStatus.value == "ทั้งหมด" || selectedStatus.value == "All" || !selectedStatus.value) {
      data = {
        populate: ["tra_id_course", "tra_created_by"],
        // where: {
        //   hcs_stasus_change: "created"
        // }
      }
    }
    else if (selectedStatus.value) {
      let where = ''
      if (selectedStatus.value == "Pending") {
        where = "รออนุมัติ"
      }
      if (selectedStatus.value == "Approved") {
        where = "อนุมัติแล้ว"
      }
      if (selectedStatus.value == "Not Approved") {
        where = "ไม่อนุมัติ"
      }
      if (selectedStatus.value == "Training Progress") {
        where = "กำลังจัดอบรม "
      }
      if (selectedStatus.value == "Waiting Summary Report") {
        where = "รอรายงานสรุปผล"
      }
      if (selectedStatus.value == "Training Completed") {
        where = "เสร็จสิ้นการอบรม"
      }
      data = {
        populate: ["tra_id_course", "tra_created_by"],
        where: {
          tra_status_approve: where
        }
      }
    }

    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/get/eec_trainings`, data, { headers }
    ).then((result) => {
      console.log(result)
      dataTable.value = result.data
      console.log(dataTable.value)
    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }

}
function formatISODate(isoDate) {
  const date = new Date(isoDate);
  console.log(isoDate)
  const formattedDate = date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  return formattedDate;
};

const deleteCourse = async () => {
  // sweetalertService.showConfirmation("ยืนยันที่จะลบใช่หรือไม่ ?", "")
  const result = await sweetalertService.showAlert(
    "ยืนยันที่จะลบใช่หรือไม่",
    "โปรดเลือกดำเนินการที่คุณต้องการ !",
    "warning",
    t("button.confirm"),
    t("button.cancel")
  );
  if (result.isConfirmed) {
    await sweetalertService.showSuccessTimeOut(
      t("sweetAdd.complete"),
      "ลบเรียบร้อย"
    );

  } else {
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.cancel"),
      "ยกเลิการลบเรียบร้อย",
      "error"
    );
  }
};

const editFormEB02 = (id) => {
  console.log("id" + " " + id)
  router.push({
    name: 'type-bform-eb02',
    params: {
      data: id, type: 'edit'
    }
  })
};
const addFormEB02 = () => {
  router.push({
    name: 'type-bform-eb02',
    params: {
      type: 'add'
    }
  })
};
const formEB03 = (id) => {
  console.log("id" + " " + id)
  router.push({
    name: 'type-bform-eb03',
    params: {
      id: id
    }
  })
};
const formEB04 = (id) => {
  console.log("id" + " " + id)
  router.push({
    name: 'type-bform-eb04',
    params: {
      id: id
    }
  })
};

const textPending = computed(() => t("manageTraining.filter.Pending"))
const textApproved = computed(() => t("manageTraining.filter.Approved"))
const textNotApproved = computed(() => t("manageTraining.filter.Not Approved"))
const textTrainingProgress = computed(() => t("manageTraining.filter.Training Progress"))
const textWaitingSummaryReport = computed(() => t("manageTraining.filter.Waiting Summary Report"))
const textTrainingCompleted = computed(() => t("manageTraining.filter.Training Completed"))

const resolveStatusVariant = (status) => {
  if (status == "รออนุมัติ") return { color: "warning", text: textPending };
  else if (status == "อนุมัติแล้ว") return { color: "success", text: textApproved };
  else if (status == "ไม่อนุมัติ") return { color: "error", text: textNotApproved };
  else if (status == "กำลังจัดอบรม") return { color: "primary", text: textTrainingProgress };
  else if (status == "รอรายงานสรุปผล") return { color: "info", text: textWaitingSummaryReport };
  else if (status == "เสร็จสิ้นการอบรม") return { color: "secondary", text: textTrainingCompleted };


};
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
</script>

<style scoped lang="scss">
.footer-paginate {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 4px;
}

hr {
  border: 1px solid rgba(0, 0, 0, 10%);
}

.container {
  display: flex;
  align-items: center;
  height: 100%;
}

.required-text {
  color: red;
}
</style>
