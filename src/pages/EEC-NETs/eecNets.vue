/*
* eecNets
* Manage EEC-NETs
* Author: Teerajuk Sakunchaisitthichok
* Create date: 18 June 2024
*/
<script setup lang="js">

import { router } from "@/plugins/1.router";
import axios from 'axios';
import { onMounted, ref, watch } from "vue";
import { useI18n } from 'vue-i18n';
import sweetalertService from '../../../service/sweetalertService';
const { t } = useI18n();

const eecNets = ref([]);
const search = ref("");
/*
 * deleteItem()
 * Confirm delete item
 * param: -
 * return: delete data from system
*/
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
      await editStatusDelete(item);
      getFilter();
      getEecNets()
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

/*
 * options
 * Data paginate
 * param: -
 * return: -
*/
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

/*
 * headers
 * Header pull data item in data table
 * param: -
 * return: data in data table
*/
const headers = computed(() => [
  { title: t('eecNets.manage.header.networkCenter'), key: "net_name", width: '400px', filterable: true },
  { title: t("eecNets.manage.header.city"), key: "net_city", width: '200px', filterable: false },
  { title: t("eecNets.manage.header.typeNetwork"), key: "net_type", width: '200px', filterable: false },
  { title: t("eecNets.manage.header.location"), key: "net_location", width: '300px', filterable: false },
  { title: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 " + t("eecNets.manage.header.action"), key: "action", align: 'center', width: '200px', filterable: false },
]);

/*
 * openEditDialog
 * Open form to edit
 * param: -
 * return: -
*/
const openEdit = (id) => {
  router.push({
    name: 'eecnets-edit-eec-nets-data',
    params: {
      id: id
    }
  })
};



// -------------------- View Data -----------------------------------

const isViewDialogOpen = ref(false);
const selectedRow = ref(null);
/*
 * openViewDialog
 * Open Dialog for view data
 * param: -
 * return: data from id or index
*/
const openViewDialog = (item) => {
  selectedRow.value = item;
  isViewDialogOpen.value = true;
};

/*
 * closeViewDialog
 * Close Dialog view data
 * param: -
 * return: -
*/
const closeViewDialog = (item) => {
  isViewDialogOpen.value = false;
};


/*
 * getEecNets
 * Fetch EEC-Nets data based on selected option
 * param: -
 * return: data from API
*/
const getEecNets = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    let where = {
      net_status: { $ne: 'Delete' }
    };
    if (selectedOption.value && selectedOption.value !== 'ทั้งหมด') {
      where.net_type = selectedOption.value;
    }

    if (selectedOptionCity.value && selectedOptionCity.value !== 'ทั้งหมด') {
      where.net_city = selectedOptionCity.value;
    }
    const response = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_nets`, {
      where: where,
    }, { headers });
    // .then(() =>{

    // })
    eecNets.value = response.data;

  } catch (error) {
    console.log(error);
  }
};


const selectedOption = ref();
const typeItems = ref([]);

const selectedOptionCity = ref();
const cityItems = ref([]);

const getFilter = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/eecNets`, { headers });

    typeItems.value = ["ทั้งหมด", ...response.data.net_type];
    cityItems.value = ["ทั้งหมด", ...response.data.net_city];


  } catch (error) {
    console.log(error);
  }
}
const clearFilters = () => {
  selectedOption.value = null;
  selectedOptionCity.value = null;
  eecNets.value = [];

};

const editStatusDelete = async (id) => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_nets/${id}`, {
      data: {
        net_status: 'Delete'
      },
    }, { headers })
  } catch (error) {
    console.log(error);
  }
}
watch([selectedOption, selectedOptionCity], () => {
  if (!selectedOption.value && !selectedOptionCity.value) {
    eecNets.value = []; // ทำให้ข้อมูลในตารางหายไปเมื่อฟิลเตอร์ว่างเปล่า
  } else {
    getEecNets();
  }
});


onMounted(() => {
  getFilter();
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

.view-data {
  display: flex;
  justify-content: space-between;
  margin-block-end: 2vh;
}
</style>

<template>
  <div>
    <VCard title="">
      <template v-slot:title>
        <div>
          <h3>{{ $t('eecNets.manage.manageEecNetsData') }}</h3>
        </div>
      </template>
      <hr />
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <AppTextField v-model="search" :placeholder="'| '+ $t('eecNets.manage.filter.search')" prepend-inner-icon="tabler-search" single-line
              hide-details dense outlined />
          </VCol>
          <VCol cols="12" md="2" class="text-right">
            <AppAutocomplete v-model="selectedOptionCity" :items="cityItems" :placeholder="$t('eecNets.manage.filter.city')"/>
          </VCol>
          <VCol cols="12" md="2" class="text-right">
            <AppAutocomplete v-model="selectedOption" :items="typeItems" :placeholder="$t('eecNets.manage.filter.type')" />
          </VCol>
          <VCol cols="12" md="2" class="text-left">
            <VBtn variant="outlined" color="warning" @click="clearFilters">
              {{ $t('button.clear') }}
            </VBtn>
          </VCol>
          <VCol cols="12" md="2" offset-md="1" class="text-right">
            <VBtn color="info" @click="$router.push({ name: 'eecnets-eec-nets-form-add' })">
              <VIcon icon="tabler-pencil-plus" start />
              {{ $t('button.increaseData') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <hr />

      <VDataTable :headers="headers" :search="search" :items="eecNets" :items-per-page="options.itemsPerPage"
        :page="options.page" :options="options" :no-data-text="$t('noDataAvailable')">

        <template #bottom>
          <hr />

          <VCardText class="pt-2">
            <div class="footer-paginate">
              <span>{{ $t('paginate.amount') }}</span>

              <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
                style="max-inline-size: 70px;" class="ms-2 me-2" />
              <span class="me-2">{{ $t('paginate.rowPerPage') }}</span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(eecNets.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>

        <template #item.action="{ item }">
          <div class="d-flex justify-center">
            <IconBtn>
              <VIcon icon="tabler-eye" @click="openViewDialog(item)" />
              <VTooltip open-delay="100" location="top" activator="parent">
                <span>{{ $t('button.viewMoreDetail') }}</span>
              </VTooltip>
            </IconBtn>
            <IconBtn>
              <VIcon icon="tabler-edit" @click="openEdit(item._id)" />
              <VTooltip open-delay="100" location="top" activator="parent">
                <span>{{ $t('button.editData') }}</span>
              </VTooltip>
            </IconBtn>
            <IconBtn>
              <VIcon icon="tabler-trash" @click="deleteItem(item._id)" />
              <VTooltip open-delay="100" location="top" activator="parent">
                <span>{{ $t('button.deleteData') }}</span>
              </VTooltip>
            </IconBtn>
          </div>
        </template>
      </VDataTable>

      <!-- Show Data -->
      <VDialog v-model="isViewDialogOpen" max-width="70vw">
        <VCard>
          <template v-slot:title>
            <div class="view-data">
              <div>
                <h3 class="">
                  {{ $t('eecNets.manage.viewEecNetsData') }}
                </h3>
              </div>

              <div>
                <VIcon icon="mdi-close-circle" start class="flip-in-rtl" @click="closeViewDialog" />
              </div>
            </div>
          </template>
          <hr>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <h3>
                  {{ $t('eecNets.manage.networkCenterData') }}

                </h3>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_name" :label="$t('eecNets.manage.detail.networkCenter')"
                  readonly />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_type" :label="$t('eecNets.manage.detail.typeNetworkCenter')"
                  readonly />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_location" :label="$t('eecNets.manage.detail.location')"
                  readonly />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_city" :label="$t('eecNets.manage.detail.city')" readonly />
              </VCol>
            </VRow>
          </VCardText>
          <hr>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <h3>
                  {{ $t('eecNets.manage.informationOnCooperationWithAgenciesOrEstablishments') }}
                </h3>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_department"
                  :label="$t('eecNets.manage.detail.nameOfAgencyOrEstablishment')" readonly />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_cooperation" :label="$t('eecNets.manage.detail.cooperation')"
                  readonly />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="selectedRow.net_address" :label="$t('eecNets.manage.detail.contactLocation')"
                  readonly />
              </VCol>

              <VCol cols="12" md="3">
                <AppTextField v-model="selectedRow.net_phone" :label="$t('eecNets.manage.detail.contactPhoneNumber')"
                  readonly />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField v-model="selectedRow.net_email" :label="$t('eecNets.manage.detail.email')" readonly />
              </VCol>

            </VRow>
          </VCardText>
          <hr>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <h3>
                  {{ $t('eecNets.manage.informationOnProductionAndPersonnelSkillDevelopment') }}
                </h3>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextarea v-model="selectedRow.net_product"
                  :label="$t('eecNets.manage.detail.informationOnProduction')" readonly />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextarea v-model="selectedRow.net_develop"
                  :label="$t('eecNets.manage.detail.personnelSkillDevelopment')" readonly />
              </VCol>
            </VRow>
          </VCardText>
          <hr>
          <VCardText>
            <VRow>
              <VCol md="6" offset-md="6" class="text-right">
                <VBtn color="primary" variant="tonal" @click="openEdit(selectedRow._id)">
                  <VIcon icon="tabler-edit" start />
                  {{ $t('button.editData') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VDialog>

    </VCard>
  </div>
</template>
