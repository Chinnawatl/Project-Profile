<script setup>
import eecLogo from "@images/eecImages/logoEEC.png";
import axios from 'axios';
import { onMounted, ref } from "vue"; // Ensure you have the necessary imports for Vue
import { useRoute } from 'vue-router';
import sweetalertService from '../../../service/sweetalertService';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const route = useRoute();

// Rename this variable to avoid conflict
const jobData = ref([]);
const id = ref('');


// Declare form fields
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const city = ref("");
const country = ref("");
const search = ref("");
const itemsPerPage = ref(8)
const page = ref(1)
const totalPages = computed(() => Math.ceil((jobData.value.total?.length) / itemsPerPage.value));



onMounted(async () => {
  id.value = route.params.id
  await getPercentMap();
})

const getPercentMap = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    console.log(id.value)
    await axios
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/matchDemand/${id.value}`, { headers },)
      .then((result) => {
        jobData.value = result.data;
        sweetalertService.showSuccessTimeOut(
          t("matching.demandMatch.matchingLoad.success"),
          t("matching.demandMatch.matchingLoad.result")
        );
      })
    console.log(jobData.value)
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }
}

const paginatedJobData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return jobData.value?.total?.slice(start, end);
});
</script>

<style lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 10%);
}

.scrollable-chips {
  max-height: 200px;
  /* ปรับความสูงตามต้องการ */
  overflow-y: auto;
  /* ทำให้สามารถเลื่อนแนวตั้งได้ */
}

.scrollable-chips::-webkit-scrollbar {
  width: 0px;
  background: transparent;
  /* หรือซ่อนแถบเลื่อนแนวนอนด้วย */
}

.responsive-img {
  object-fit: cover;
  width: 100%;
  height: auto;
}
.card-fixed-height {
  height: 90%;
  width: 90%;
}
</style>

<template>
  <VCard class="pa-3 pa-sm-10 mt-5">
    <VRow>
      <!-- 👉 First Name -->
      <VCol cols="12" md="4">
        <V-Card>
          <img :src="eecLogo" height="130" width="250" />
        </V-Card>
      </VCol>

      <!-- 👉 Last Name -->
      <VCol cols="12" md="4" v-if="jobData.id">
        <VCardText>
          <span>
            <h2>{{ $t('matching.demandMatch.course') }} {{ jobData.id.typa_name || jobData.id.typb_name_course }}</h2>
          </span>
          <span class="ma-1">
            <h3>
              {{ $t('matching.demandMatch.courseOwner') }} {{ jobData.id.typa_academy || jobData.id.typb_academy }}
            </h3>
          </span>

        </VCardText>
      </VCol>
      <VCol cols="12" md="4" v-if="jobData.id">
        <VCardText>
          <div class="d-flex flex-wrap scrollable-chips">
            <VChip class="ma-1"
              v-for="(job_skill, skillIndex) in jobData.id.typb_skill_set || jobData.id.typa_skill_set"
              :key="skillIndex">
              {{ job_skill }}
            </VChip>
          </div>
        </VCardText>
      </VCol>
    </VRow>

  </VCard>

  <VCard class="mt-5" v-if="jobData.total != 0">
    <VCardText class="pa-4">
      <h1>{{ $t('matching.demandMatch.position') }}</h1>
    </VCardText>
    <hr />
    <VRow>
      <VCol cols="12" sm="6" md="3" v-for="(header, index) in paginatedJobData" :key="index">
        <VCard class="ma-6 d-flex flex-wrap card-fixed-height">
          <VImg :src="eecLogo" class="responsive-img" height="130" />
          <VCardText class="d-flex flex-column ">
            <h5 class="text-h5 mb-1">
              {{ header.job_name }}
            </h5>
            <p class="mb-2">
              {{ header.job_company }}
            </p>
            <div class="d-flex flex-wrap">
              <VChip class="ma-1" v-for="(skill, skillIndex) in header.job_skill_set" :key="skillIndex">
                {{ skill }}
              </VChip>
            </div>

          </VCardText>
          <VProgressLinear v-model="header.percent" color="success" height="20" class=" mr-6 my-2">
            <span>{{ header.percent }}%</span>
          </VProgressLinear>
        </VCard>
      </VCol>
    </VRow>
    <VPagination v-model="page" active-color="primary" first-icon="tabler-chevrons-left"
      last-icon="tabler-chevrons-right" show-first-last-page :length="totalPages"
      :total-visible="$vuetify.display.smAndDown ? 3 : 5" />
  </VCard>
  <div v-else class="text-center mt-5">
    <h2> {{ $t('noDataAvailable') }}</h2>
  </div>
</template>
