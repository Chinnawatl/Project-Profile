<script setup>
import { router } from "@/plugins/1.router";
import eecLogo from "@images/eecImages/logoEEC.png";
import axios from 'axios';
import { onMounted, ref, computed } from 'vue'; // Ensure you have the necessary imports for Vue

const position = ref([]);
const search = ref('');
const itemsPerPage = ref(8)
const page = ref(1)

onMounted(async () => {
  await getPosition();
});

const getPosition = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    await axios
      .post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_jobs`, {
        where: {
          job_status: { $ne: 'Delete' },
        },
      }, { headers })
      .then((result) => {
        position.value = result.data;
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

const handleCardClick = (header) => {
  router.push({ name: 'matching-supply-match', params: { id: header._id } });
  console.log('Clicked card:', header._id);
};

const filteredPositions = computed(() => {
  return position.value.filter(pos => {
    const searchTerm = search.value.toLowerCase();
    return (
      pos.job_name.toLowerCase().includes(searchTerm) ||
      pos.job_company.toLowerCase().includes(searchTerm) ||
      pos.job_skill_set.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  });
});

const paginatedPosition = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPositions.value.slice(start, end);
});

const truncatedText =  (text) => {
  console.log("data=", text);
  if (text.length > 10) {
    
    text = text.slice(0, 10) + '...' ;
    
    return text
  }
  return text ; // Return an empty string if text is undefined or null
};



</script>

<template>
  <VCard class="mt-5">
    <VCardText class="px-4" style="padding-block: 1rem 1.2rem;">
      <h1>{{ $t("matching.Deman.headPosition") }}</h1>
    </VCardText>
    <hr>
    <VCardText class="ma-4">
      <VRow>
        <VCol cols="6" md="3">
          <AppTextField v-model="search" placeholder="Search" prepend-inner-icon="tabler-search" single-line
            hide-details dense outlined />
        </VCol>
        <VCol cols="6" md="4" offset-md="5" class="d-flex gap-4 mt-10 mb-10 justify-content-end">
          <VBtn variant="outlined" class="ml-auto" @click="() => $router.push({ name: 'matching-deman' })"> {{
            $t("matching.Deman.BTNselect.BTNposition") }} </VBtn>
          <VBtn variant="outlined" @click="() => $router.push({ name: 'matching-supply' })"> {{
            $t("matching.Deman.BTNselect.BTNcourse") }} </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <VRow>
      <VCol cols="12" sm="6" md="3" v-for="(header, index) in paginatedPosition" :key="index">
        <VCard class="ma-6 d-flex flex-wrap card-fixed-height"  @click="handleCardClick(header)">
          <VImg :src="eecLogo" class="responsive-img" height="130" />
          <VCardText class="d-flex flex-column">
            <h5 class="text-h5 text-no-wrap">
              {{ header.job_name }}
            </h5>
            <p class="mb-2">
              {{ header.job_company }}
            </p>
            <div class="d-flex flex-wrap ">
              <VChip class="ma-1" v-for="(job_skill_set, skillIndex) in (header.job_skill_set).slice(0,5)" :key="skillIndex"
                hover>

                {{ truncatedText(job_skill_set) }}
                <VTooltip open-delay="100" location="top" activator="parent">
                <span>{{ job_skill_set }}</span>
              </VTooltip>
              </VChip>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VPagination
        v-model="page"
        active-color="primary"
        first-icon="tabler-chevrons-left"
        last-icon="tabler-chevrons-right"
        show-first-last-page
        :length="Math.ceil(filteredPositions.length / itemsPerPage)"
        :total-visible="$vuetify.display.smAndDown ? 3 : 5"
        class="mb-2"
      />
  </VCard>
</template>

<style lang="scss">
.card-fixed-height {
  height: 90%;
  width: 90%;
}

.responsive-img {
  object-fit: cover;
  width: 100%;
}
</style>
