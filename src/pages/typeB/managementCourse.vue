<template>
  <div>
    <VCard title="">
      <template v-slot:title>
        <div class="d-flex">
          <h3>
            {{ $t('manageCourse.title') }}
          </h3>
        </div>
      </template>
      <hr />
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <AppTextField :label="$t('manageCourse.search')" v-model="search"
              :placeholder="$t('manageCourse.placeholdersearch')" prepend-inner-icon="tabler-search" single-line
              hide-details dense outlined />
          </VCol>
          <VCol cols="12" md="2">
            <AppAutocomplete :label="$t('manageCourse.status')" @update:model-value="handleUpdate"
              v-model="selectedStatus" :items="statusItem" :placeholder="$t('manageCourse.placeholderstatus')" />
          </VCol>
          <VCol cols="12" md="2">
            <div class="container">
              <span class="required-text">{{ $t('manageCourse.required') }}</span>
            </div>
            <!-- <span style="justify-content: center; color: red;">{{ $t('manageCourse.required') }}</span> -->
          </VCol>

          <VCol cols="12" md="7" offset-md="5" class="text-right">
            <VBtn color="info" @click="addFormEB01()">
              <!-- เพิ่มข้อมูล -->
              {{ $t('manageCourse.buttonAdd') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <hr />
      <VDataTable :headers="headersTable" :no-data-text="$t('manageCourse.noData')" :search="search" :items="dataTable"
        :items-per-page="options.itemsPerPage" :page="options.page" :options="options">
        <template #bottom>
          <hr />
          <VCardText class="pt-2">
            <div class="footer-paginate">
              <span>{{ $t("manageCourse.table.amount") }}</span>

              <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
                style="max-width: 4vw" class="ms-2 me-2" />
              <span class="me-2">{{ $t("manageCourse.table.rowPerPage") }}</span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 1 : 3"
                :length="Math.ceil(dataTable.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex">
            <IconBtn @click="editFormEB01(item._id)">
              <VIcon icon="tabler-edit" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ $t("manageTraining.tooltip.edit") }}</span>
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

        <template #item.CREATED_AT="{ item }">
          {{ formatISODate(item.CREATED_AT) }}
        </template>
        <template #item.typb_status_approve="{ item }">
          <VChip :color="resolveStatusVariant(item.typb_status_approve).color" size="small">
            {{ resolveStatusVariant(item.typb_status_approve).text }}
          </VChip>
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

  // getCourseData()
})
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const textPending = computed(() => t("manageCourse.filter.Pending"))
const textApproved = computed(() => t("manageCourse.filter.Approved"))
const textNotApproved = computed(() => t("manageCourse.filter.Not Approved"))
const statusItem = computed(() => [t("manageCourse.filter.All"), t("manageCourse.filter.Pending"), t("manageCourse.filter.Approved"), t("manageCourse.filter.Not Approved")]);
const selectedStatus = ref();
const search = ref("");
const headersTable = computed(() => [
  // { title: "ชื่องาน", key: "nameTask" },
  { title: t("manageCourse.table.typb_name_course"), key: "typb_name_course" },
  { title: t("manageCourse.table.typb_created_by"), key: "typb_created_by.user_first_name" },
  { title: t("manageCourse.table.CREATED_AT"), key: "CREATED_AT" },
  { title: t("manageCourse.table.typb_status_approve"), key: "typb_status_approve" },
  { title: t("manageCourse.table.action"), key: "action" },
]);
let dataTable = ref([])

const editFormEB01 = (id) => {
  console.log("id" + " " + id)
  router.push({
    name: 'type-bform-eb01',
    params: {
      data: id, type: 'edit'
    }
  })
};

const addFormEB01 = () => {
  router.push({
    name: 'type-bform-eb01',
    params: {
      type: 'add'
    }
  })
};

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
function handleUpdate(value) {
  selectedStatus.value = value
  getCourseData()
}
async function getCourseData() {
  console.log('selectedStatus.value')
  console.log(selectedStatus.value)
  try {
    let data = {}
    if (selectedStatus.value == "ทั้งหมด" || selectedStatus.value == "All" || !selectedStatus.value) {
      data = {
        populate: ["typb_created_by"],
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
      data = {
        populate: ["typb_created_by"],
        where: {
          typb_status_approve: where
        }
      }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/get/eec_type_b`, data, { headers }
    ).then((result) => {
      console.log(result)
      dataTable.value = result.data
    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }

}
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
const resolveStatusVariant = (typb_status_approve) => {
  console.log("typb_status_approve");
  console.log(typb_status_approve);

  if (typb_status_approve == "รออนุมัติ") return { color: "warning", text: textPending };
  else if (typb_status_approve == "อนุมัติแล้ว") return { color: "success", text: textApproved };
  else if (typb_status_approve == "ไม่อนุมัติ") return { color: "error", text: textNotApproved };
};
</script>

<style lang="scss" scoped>
.footer-paginate {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px;
  justify-content: flex-end;
}

hr {
  border: 1px solid rgba(0, 0, 0, 0.1);
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
