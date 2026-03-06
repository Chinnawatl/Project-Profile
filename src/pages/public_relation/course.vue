<script setup lang="js">
import pr1 from '@images/eecImages/eec-hdc.jpg';
import NavbarPublic from '../../layouts/components/NavBarPublic.vue';
import { router } from "@/plugins/1.router";
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';


const courseData = ref([]);
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

onMounted(async () => {
  await getCourse();
});

const paginatedCourses = computed(() => {
  // ตรวจสอบว่ามีข้อมูลใน courseData หรือไม่
  if (!courseData.value || courseData.value.length === 0) {
    return []; // หากไม่มีข้อมูลให้คืนค่าเป็นอาร์เรย์เปล่า
  }

  // กำหนดข้อมูลที่จะใช้ในหน้าแสดงผล
  return courseData.value; 
});

const truncatedText =  (text) => {
  console.log("data=", text);
  if (text.length > 10) {
    
    text = text.slice(0, 10) + '...' ;
    
    return text
  }
  return text ; // Return an empty string if text is undefined or null
};



definePage({ meta: { layout: 'blank' } })
</script>

<template>
  <NavbarPublic />

  <VRow>
    <VCol cols="12" md="6">
      <VCardText>
        <h1>{{ $t('PR.course.headC') }}</h1>
      </VCardText>
    </VCol>
    <VCol cols="12" md="6" style="margin-top: 100px; border-radius: 20px;">
      <AppTextField class="bg-color" v-model="search" :placeholder="'| '+ $t('PR.course.search')"
        prepend-inner-icon="tabler-search" single-line hide-details dense outlined />
    </VCol>
  </VRow>
  <VRow style="margin-left: 20px;">
    <VCol cols="auto" class="p-0 mx-2">
      <VBtn class="bg-warning"> {{ $t('PR.course.B1') }} </VBtn>
    </VCol>
    <VCol cols="auto" class="p-0 mx-2">
      <VBtn class="bg-warning"> {{ $t('PR.course.B2') }} </VBtn>
    </VCol>
    <VCol cols="auto" class="p-0 mx-2">
      <VBtn class="bg-warning"> {{ $t('PR.course.B3') }} </VBtn>
    </VCol>
  </VRow>

  <VRow style="margin-left: 20px;">
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

</template>

<style lang="scss" scoped>
.bg-color {
  background-color: white;
  border-radius: 30px;
}

.card {
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.centered-image {
  height: 50%;
  width: 50%;
  object-fit: contain; /* หรือ cover ขึ้นอยู่กับที่ต้องการ */
}

.chip-container {
  margin: 20px; 
}

h1{
    font-size: 50px;
    margin: 20px;
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
