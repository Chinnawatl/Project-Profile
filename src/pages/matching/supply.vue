<template>
  <VCard class="mt-5">
    <VCardText class="px-4" style="padding-block: 1rem 1.2rem;">
      <h1>{{ $t('matching.supply.course') }}</h1>
    </VCardText>
    <hr>
    <VCardText>
      <VRow>
        <VCol cols="6" md="3">
          <AppTextField v-model="search" placeholder="|ค้นหา" prepend-inner-icon="tabler-search" single-line
            hide-details dense outlined />
        </VCol>
        <VCol cols="6" md="4" offset-md="5" class="d-flex gap-4 mt-10 mb-10 justify-content-end">
          <VBtn variant="outlined" class="ml-auto" @click="() => $router.push({ name: 'matching-deman' })">{{
            $t("matching.Deman.BTNselect.BTNposition") }}
          </VBtn>
          <VBtn variant="outlined" @click="() => $router.push({ name: 'matching-supply' })"> {{
            $t("matching.Deman.BTNselect.BTNcourse") }} </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <VRow>
      <VCol cols="12" sm="6" md="3" v-for="(header, index) in paginatedCourses" :key="index">
        <VCard class="ma-6 d-flex flex-wrap card-fixed-height" 
          @click="handleCardClick(header)">
          <VImg :src="eecLogo" class="responsive-img" height="130" />
          <VCardText class="d-flex flex-column">
            <h5 class="text-h5 mb-1">
              {{ header.typa_name || header.typb_name_course }}
            </h5>
            <p class="mb-2">
              {{ header.typa_academy || header.typb_academy }}
            </p>
            <div class="d-flex flex-wrap ">
              <VChip class="ma-1"
                v-for="(skill, skillIndex) in (header.typb_skill_set || header.typa_skill_set).slice(0, 5)"
                :key="skillIndex" hover>
                {{ truncatedText(skill) }}
                <VTooltip open-delay="100" location="top" activator="parent">
                  <span>{{ skill }}</span>
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
        :length="Math.ceil(filteredCourses.length / itemsPerPage)"
        :total-visible="$vuetify.display.smAndDown ? 3 : 5"
        class="mb-2"
      />
  </VCard>
</template>

<script setup>
import eecLogo from "@images/eecImages/logoEEC.png";
import { router } from "@/plugins/1.router";
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const courseData = ref([]);
const search = ref('');
const itemsPerPage = ref(8)
const page = ref(1)

onMounted(async () => {
  await getCourse();
});

const getCourse = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    await axios
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/getBorth/eec_type_a/eec_type_b`, { headers })
      .then((result) => {
        courseData.value = result.data;
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
  router.push({ name: 'matching-deman-match', params: { id: header._id } });
  console.log('Clicked card:', header.id);
};



const filteredCourses = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return courseData.value.filter(header => {
    return (
      (header.typa_name && header.typa_name.toLowerCase().includes(searchTerm)) ||
      (header.typb_name_course && header.typb_name_course.toLowerCase().includes(searchTerm)) ||
      (header.typa_academy && header.typa_academy.toLowerCase().includes(searchTerm)) ||
      (header.typb_academy && header.typb_academy.toLowerCase().includes(searchTerm)) ||
      (header.typb_skill_set && header.typb_skill_set.some(skill => skill.toLowerCase().includes(searchTerm))) ||
      (header.typa_skill_set && header.typa_skill_set.some(skill => skill.toLowerCase().includes(searchTerm)))
    );
  });
});

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCourses.value.slice(start, end);
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

<style lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 0.1);
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
