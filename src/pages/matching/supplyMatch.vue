<script setup>
import eecLogo from "@images/eecImages/logoEEC.png";
import axios from 'axios';
import { onMounted, ref } from "vue"; // Ensure you have the necessary imports for Vue
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import sweetalertService from '../../../service/sweetalertService';

const { t } = useI18n();

const route = useRoute();

const courseData = ref([]);
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
const totalPages = computed(() => Math.ceil((courseData.value.total?.length) / itemsPerPage.value));


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
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/matchSupply/${id.value}`, { headers },)
      .then((result) => {
        courseData.value = result.data;
        sweetalertService.showSuccessTimeOut(
          t("matching.supplyMatch.matchingLoad.success"),
          t("matching.supplyMatch.matchingLoad.result")
        );
      })
    console.log(courseData.value)
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }
}
const paginatedCourseData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return courseData.value?.total?.slice(start, end);
});
</script>

<style lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 10%);
}

.card-fixed-height {
  height: 90%;
  width: 90%;
}

.responsive-img {
  object-fit: cover;
  width: 100%;
  height: auto;
}
</style>

<template>
  <VCard class="pa-3 pa-sm-10 mt-5">

    <VRow>
      <!-- 👉 First Name -->
      <VCol cols="12" md="4" hight="100">
        <V-Card class="d-flex align-center justify-center">
          <img :src="eecLogo" height="150" width="250" />
        </V-Card>
      </VCol>

      <VCol cols="12" md="4" v-if="courseData.id">
        <VCardText>
          <span>
            <h1>{{ $t('matching.supplyMatch.position') }} {{ courseData.id.job_name }}</h1>
          </span>
          <span class="ma-1">
            <h3>{{ $t('matching.supplyMatch.company') }} {{ courseData.id.job_company }}</h3>
          </span>
        </VCardText>
      </VCol>

      <!-- 👉 Skills -->
      <VCol cols="12" md="4" v-if="courseData.id">
        <VCardText>
          <div class="d-flex flex-wrap">
            <VChip class="ma-1" v-for="(job_skill, skillIndex) in courseData.id.job_skill_set" :key="skillIndex">
              {{ job_skill }}
            </VChip>
          </div>
        </VCardText>
      </VCol>
    </VRow>

  </VCard>

  <VCard class="mt-5" v-if="courseData.total != 0">
    <VCardText class="px-4">
      <h1>{{ $t('matching.supplyMatch.course') }}</h1>
    </VCardText>
    <hr />
    <VRow>
      <VCol cols="12" sm="6" md="3" v-for="(header, index) in courseData.total" :key="index">
        <VCard class="ma-6 d-flex flex-wrap card-fixed-height"> <!-- ใช้ d-flex และ flex-column เพื่อจัดการ layout แบบยืดหยุ่น -->
          <VImg :src="eecLogo" class="responsive-img" height="130" />
          <VCardText class="d-flex flex-column">
            <h5 class="text-h5 mb-1">
              {{ header.name_course }}
            </h5>
            <p class="mb-2">
              {{ header.academy }}
            </p>
            <div class="d-flex flex-wrap">
              <VChip class="ma-1" v-for="(skill, skillIndex) in header.skill_set" :key="skillIndex">
                {{ skill }}
              </VChip>
            </div>
          </VCardText>
            <VProgressLinear v-model="header.percent" color="success" height="20" class="mr-4 my-2">
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
