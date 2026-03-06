<script setup lang="js">
import axios from 'axios';
import { onMounted, ref } from "vue";
import { VForm } from 'vuetify/components/VForm';

const getDataEducate = ref([]);
const accessTokenCookie = useCookie('accessToken')
const userDataCookie = useCookie('userData')
const id = userDataCookie.value.id

const dataEducate = async () => {
    try {
        const headers = {
            "Authorization": "Bearer " + accessTokenCookie.value
        }
        const result = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_type_a/${id}`,
            {
                headers
            },
        );
        getDataEducate.value = result.data;
        console.log("data:" + getDataEducate.value);
    } catch (error) {
        console.error(error);
    }
};

onMounted(async () => {
    await dataEducate();
})

</script>

<template>
    <VCard>
        <template v-slot:title>
            <div class="d-flex">
                <h2 class="bold">ลงทะเบียนอบรม</h2>
            </div>
        </template>
        <hr />
        <VCardText>
            <VForm ref="" @submit.prevent="">
                <VRow>
                    <VCol cols="12" md="6">
                        <AppTextField v-model="getDataEducate.typa_name" label="หลักสูตร" placeholder="หลักสูตร"
                            readonly />
                    </VCol>

                    <VCol cols="12" md="6">
                        <AppTextField v-model="getDataEducate.typa_academy" placeholder="สถานศึกษา" label="สถานศึกษา"
                            readonly />
                    </VCol>

                    <VCol cols="12" md="6">
                        <AppTextarea v-model="getDataEducate.typa_detail" label="คำอธิบายหลักสูตร" rows="3"
                            placeholder="คำอธิบายหลักสูตร" readonly />
                    </VCol>

                    <VCol cols="12" md="6">
                        <AppTextarea v-model="getDataEducate.typa_goal" label="วัตถุประสงค์" rows="3"
                            placeholder="วัตถุประสงค์" readonly />
                    </VCol>

                    <VCol cols="12" md="6">
                        <AppTextarea v-model="getDataEducate.typa_level" label="ระดับเนื้อหา" rows="3"
                            placeholder="ระดับเนื้อหา" readonly />
                    </VCol>

                    <VCol cols="12" md="6">
                        <AppTextarea v-model="getDataEducate.typa_structure" label="โครงสร้างหลักสูตร" rows="3"
                            placeholder="โครงสร้างหลักสูตร" readonly />
                    </VCol>

                    <VCol cols="12">
                        <AppCombobox v-model="getDataEducate.typa_skill_set" placeholder="ทักษะ" label="ทักษะ" multiple
                            chips readonly />
                    </VCol>

                    <VCol cols="12" class="d-flex justify-center align-center gap-4">
                        <VBtn type="reset" color="error" @click="cancelForm">
                            ยกเลิก
                        </VBtn>

                        <VBtn type="submit" color="success">
                            บันทึก
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
</template>
