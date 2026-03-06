<script setup lang="js">
// Importing necessary modules and components
import eecLogo from "@images/eecImages/logoEEC.png";
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useI18n } from 'vue-i18n';

// Setting up reactive variables
const courseEducate = ref([]);
const courseDetail = ref(false);
const detailDialog = ref(null);
const search = ref('');

// Function to fetch courses from the API
const getCourse = async () => {
    const accessTokenCookie = useCookie('accessToken')
    const userDataCookie = useCookie('userData')
    const id = userDataCookie.value.id
    const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
    }
    try {
        const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_my_course`,
            {
                where: {
                    myc_user: id,
                },
                populate: ["myc_type_b" || "myc_type_a"],
            }, { headers }
        );
        courseEducate.value = result.data;
        console.log("data : " + result.data)
    } catch (error) {
        console.error(error);
    }
};

// Function to open the detail dialog for a course
const openDialogDetail = (item) => {
    detailDialog.value = item;
    courseDetail.value = true;
}

// Function to close the detail dialog
const closeDetailDialog = () => {
    courseDetail.value = false;
    detailDialog.value = null;
}

// Compute filtered courses based on the search term
const filteredCourses = computed(() => {
    const searchTerm = search.value.toLowerCase();
    return courseEducate.value.filter(header => {
        const name = header.myc_type_b.typb_name_course || header.myc_type_a.typa_name_course || '';
        const academy = header.myc_type_b.typb_academy || header.myc_type_a.typa_academy || '';
        const skills = header.myc_type_b.typb_skill_set || header.myc_type_a.typa_skill_set || [];

        return (
            name.toLowerCase().includes(searchTerm) ||
            academy.toLowerCase().includes(searchTerm) ||
            skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
    });
});

// Fetch courses when component is mounted
onMounted(() => {
    getCourse();
});

</script>

<template>
    <VCard>
        <template v-slot:title>
            <h3>
                {{ $t("myCourse.My Course") }}
            </h3>
        </template>
        <hr>
        <VCardText>
            <VCol cols="6" md="3">
                <AppTextField v-model="search" :placeholder="'| ' + $t('myCourse.Search')" prepend-inner-icon="tabler-search" single-line
                    hide-details dense outlined />
            </VCol>
        </VCardText>
        <hr>
        <v-card class="pa-3 pa-sm-5 mt-5" v-for="(header, index) in filteredCourses" :key="index">
            <VRow>
                <VCol cols="12" md="4">
                    <img :src="eecLogo" height="130" width="250" />
                    <VCardText>
                        <p>{{ $t("myCourse.Couse Owner") + ": "}} {{ header.myc_type_b.typb_academy || header.myc_type_a.typa_academy }}</p>
                    </VCardText>
                </VCol>
                <VCol cols="12" md="5">
                    <span>
                        <h2>{{ $t("myCourse.Course") + ": " }} {{  header.myc_type_b.typb_name_course || header.myc_type_a.typa_name_course }}</h2>
                    </span>
                    <VChip class="ma-1" v-for="(skillSet, skillIndex) in header.myc_type_b.typb_skill_set || header.myc_type_a.typa_skill_set"
                        :key="skillIndex">
                        <h3>{{ skillSet }}</h3>
                    </VChip>
                    <span>
                        <h3>{{ $t("myCourse.Start Date") + ": "}} {{ header.myc_start_date }}</h3>
                    </span>
                </VCol>
                <VCol cols="12" md="3" class="d-flex align-end justify-end">
                    <VBtn variant="outlined-info" @click="openDialogDetail(header)">
                        {{ $t("myCourse.View Details") }}
                    </VBtn>
                </VCol>
            </VRow>
            <hr>
        </v-card>
    </VCard>
</template>

<style lang="scss">
hr {
    border: 1px solid rgba(0, 0, 0, 10%);
}
</style>
