<template>
  <div>
    <VCard>
      <template v-slot:title>
        <div class="d-flex">
          <h3>
            {{ $t('manageTraining.titleApproval') }}

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
        </VRow>
      </VCardText>
      <hr />
      <VDataTable :headers="headersTable" :no-data-text="$t('manageTraining.noData')" :items="dataTable"
        :items-per-page="options.itemsPerPage" :page="options.page" :options="options">
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
        <template #item.action="{ item }">
          <div class="d-flex">
            <IconBtn @click="approveFormEB02(item._id)">
              <VIcon icon="tabler-checkbox" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ $t("manageTraining.tooltip.approve") }}</span>
              </VTooltip>
            </IconBtn>
            <!-- <IconBtn>
              <VIcon @click="deleteCourse" icon="tabler-trash" />
            </IconBtn> -->
          </div>
        </template>
        <template #item.CREATED_AT="{ item }">
          {{ formatISODate(item.CREATED_AT) }}
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>


<script setup>
import { router } from "@/plugins/1.router";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const accessTokenCookie = useCookie('accessToken')

const headers = {
  "Authorization": "Bearer " + accessTokenCookie.value
}
onMounted(async () => {

  getTrainingData()
})
const search = ref("")
const headersTable = computed(() => [
  // { title: "ชื่องาน", key: "nameTask" },
  { title: t("manageTraining.table.typb_name_course"), key: "tra_id_course.typb_name_course" },
  { title: t("manageTraining.table.typb_created_by"), key: "tra_created_by.user_first_name" },
  { title: t("manageTraining.table.CREATED_AT"), key: "CREATED_AT" },
  { title: t("manageTraining.table.action"), key: "action" },
]);



const dataTable = ref([])

const isDialogVisible = ref(false)

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const approveFormEB02 = (id) => {
  console.log("id" + " " + id)
  router.push({
    name: 'type-bform-eb02',
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

async function getTrainingData() {
  console.log("test")
  try {
    const data = {
      populate: ["tra_id_course", "tra_created_by"],
      where: {
        tra_status_approve: "รออนุมัติ"
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
</script>

<style lang="scss">
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
</style>
