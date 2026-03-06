<template>
  <div>
    <VCard title="">
      <template v-slot:title>
        <div class="d-flex">
          <h3>
            {{ $t('manageCourse.titleApproval') }}
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
        </VRow>
      </VCardText>
      <hr />
      <VDataTable :headers="headersTable" :no-data-text="$t('manageCourse.noData')" :items="dataTable"
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
        <template #item.CREATED_AT="{ item }">
          {{ formatISODate(item.CREATED_AT) }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex">

            <IconBtn @click="approveFormEB01(item._id)">
              <VIcon icon="tabler-checkbox" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>อนุมัติหลักสูตร</span>
              </VTooltip>
            </IconBtn>
            <!-- <IconBtn>
              <VIcon @click="deleteCourse" icon="tabler-trash" />
            </IconBtn> -->
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
const { t } = useI18n();
const accessTokenCookie = useCookie('accessToken')
const headers = {
  "Authorization": "Bearer " + accessTokenCookie.value
}
onMounted(async () => {

  getCourseData()
})
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const search = ref("");
const headersTable = computed(() => [
  // { title: "ชื่องาน", key: "nameTask" },
  { title: t("manageCourse.table.typb_name_course"), key: "typb_name_course" },
  { title: t("manageCourse.table.typb_created_by"), key: "typb_created_by.user_first_name" },
  { title: t("manageCourse.table.CREATED_AT"), key: "CREATED_AT" },
  { title: t("manageCourse.table.action"), key: "action" },
]);

const dataTable = ref([]);
// const deleteCourse = () => {
//   sweetalertService.showConfirmation("ยืนยันที่จะลบใช่หรือไม่ ?", "")
// };
async function getCourseData() {
  console.log("test")
  try {
    const data = {
      populate: ["typb_created_by"],
      where: {
        typb_status_approve: "รออนุมัติ"
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

const approveFormEB01 = (id) => {
  console.log("id" + " " + id)
  router.push({
    name: 'type-bform-eb01',
    params: {
      data: id, type: 'approve'
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
</script>

<style lang="scss">
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
</style>
