<template>
  <div>
    <VCard>
      <template v-slot:title>
        <div class="d-flex">
          <h2 class="bold">{{ $t('matching.manageDemand.managePosition') }}</h2>
        </div>
      </template>
      <hr />
      <VCardText>
        <VRow>
          <VCol cols="3">
            <AppTextField v-model="search" id="search" prepend-inner-icon="tabler-search" placeholder="ค้นหา" />
          </VCol>
          <VCol cols="12" md="2" class="text-right">
            <AppAutocomplete v-model="selectedOptionPosition" :items="PositionItems" :custom-filter="customFilter"
              placeholder="ตำแหน่ง" />
          </VCol>
          <VCol cols="12" md="2" class="text-right">
            <AppAutocomplete v-model="selectedOptionCompany" :items="CompanyItems" :custom-filter="customFilter"
              placeholder="บริษัท" />
          </VCol>
          
          <VCol cols="12" md="1" class="text-right">
            <VBtn variant="outlined" color="warning" @click="clearFilters">
              {{ $t('button.clear') }}
            </VBtn>
          </VCol>
          <VDialog v-model="isDialogVisible" max-width="600">

            <!-- Dialog Activator -->
            <template #activator="{ props }">
              <VCol class="d-flex justify-end gap-5">
                <VBtn color="info" @click="() => $router.push({ name: 'matching-add-deman' })"> {{
                  $t('button.increaseData') }} </VBtn>
              </VCol>
            </template>

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

            <!-- Dialog Content -->
            <VCard title="User Profile">
              <VCardText>
                <VRow>
                  <VFileInput label="File input" />
                </VRow>
              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn @click="isDialogVisible = false">
                  {{ $t('button.save') }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
        </VRow>
      </VCardText>
      <hr />


      <VDataTable :headers="headers" :search="search" :items="position" :items-per-page="options.itemsPerPage" :page="options.page"
        :options="options">
        <template #bottom>
          <hr />
          <VCardText class="pt-2">
            <div class="footer-paginate">
              <span>{{ $t('paginate.amount') }}</span>

              <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
                style="max-inline-size: 4vw;" class="ms-2 me-2" />
              <span class="me-2">{{ $t('paginate.rowPerPage') }}</span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 1 : 3"
                :length="Math.ceil(position.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editItem(item)">
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn @click="deleteItem(item)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
        <template #item.job_skill_set="{ item }">
          <div class="d-flex gap-1">
            <VChip class="ma-1" v-for="(job_skill_set, skillIndex) in item.job_skill_set" :key="skillIndex">
              {{ job_skill_set }}
            </VChip>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>


<script setup lang="js">
import { router } from "@/plugins/1.router";
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useI18n } from 'vue-i18n';
import sweetalertService from '../../../service/sweetalertService';
const { t } = useI18n();

const headers = computed(() => [
  { title: t("matching.manageDemand.position"), key: "job_name" },
  { title: t("matching.manageDemand.company"), key: "job_company" },
  { title: t("matching.manageDemand.skillSet"), key: "job_skill_set" },
  { title: t("matching.manageDemand.action"), key: "action" },
]);

const search = ref([]);
const position = ref([]);
const selectedOptionCompany = ref();
const CompanyItems = ref([]);
const selectedOptionPosition = ref();
const PositionItems = ref([]);

const getFilter = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/Job`, { headers });
    console.log(response)
    if (Array.isArray(response.data)) {
      // ดึงรายชื่อบริษัททั้งหมด โดยใช้ Set เพื่อกำจัดรายการที่ซ้ำกัน
      const companies = new Set(response.data.map(item => item.job_company));
      CompanyItems.value = ["ทั้งหมด", ...companies];

      // ดึงชื่อตำแหน่งงานทั้งหมด โดยใช้ Set เพื่อกำจัดรายการที่ซ้ำกัน
      const positions = new Set(response.data.map(item => item.job_name));
      PositionItems.value = ["ทั้งหมด", ...positions];
    } else {
      console.error("Response data is not an array", response.data);
    }
  } catch (error) {
    console.log(error);
  }
};
const editItem = (item) => {
    router.push({ name: 'matching-edit-deman', params: { id: item._id } });
  };

const getPosition = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    let where = {
      job_status: { $ne: 'Delete' }
    };
    if (selectedOptionPosition.value  !== 'ทั้งหมด') {
      where.job_name = selectedOptionPosition.value;
    }

    if (selectedOptionCompany.value  !== 'ทั้งหมด') {
      where.job_company = selectedOptionCompany.value;
    }

    await axios
      .post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_jobs`, {
        where: where,
      }, { headers },
      )
      .then((result) => {
        position.value = result.data;
      })
      .catch((err) => {
        console.log(err);
      })
  } catch (error) {
    console.log(error);
  }
};
const clearFilters = () => {
  position.value = [];
  
};

const deleteItem = async (item) => {
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
          "Authorization": "Bearer " + accessTokenCookie.value
        };
        await axios
          .put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_jobs/${item._id}`, {
            data: {
              job_status: 'Delete',
            },
          }, { headers },)
          .then((result) => {
            getPosition();
            sweetalertService.showSuccessTimeOut(
              t("sweetDelete.complete"),
              t("sweetDelete.yourDataHasBeenSuccessfullyDeleted")
            );
          })
          .catch((err) => {
            console.log(err);
          })
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
    console.log(error);
  }
};

const isDialogVisible = ref(false);

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
watch([selectedOptionCompany, selectedOptionPosition], () => {
  getPosition();
});

onMounted(async () => {
  await getFilter();

});
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
