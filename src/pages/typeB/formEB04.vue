<template>
    <VCard class="mb-6" title="เอกสารรับรองจากสถานประกอบการที่เข้าอบรมระยะสั้นตามแนวทาง EEC Model (EB04)">
        <hr />
        <VForm ref="refFormEB04Page1">

            <VCardText>

                <VDataTable :headers="headersEB04" :items="dataEB04">
                    <template #item.index="{ item, index }">
                        {{ index + 1 }}
                    </template>
                    <template #item.rotg_name="{ item, index }">
                        <AppTextField v-model="item.rotg_name" placeholder="" :rules="[requiredValidator]" />
                    </template>
                    <template #item.rotg_id_card="{ item, index }">
                        <AppTextField v-model="item.rotg_id_card" placeholder="" :rules="[requiredValidator]" />
                    </template>
                    <template #item.rotg_level="{ item, index }">
                        <AppTextField v-model="item.rotg_level" placeholder="" :rules="[requiredValidator]" />
                    </template>
                    <template #item.rotg_role="{ item, index }">
                        <AppTextField v-model="item.rotg_role" placeholder="" :rules="[requiredValidator]" />
                    </template>
                    <template #item.action="{ item, index }">
                        <div class="d-flex">
                            <!-- {{ index }} -->
                            <IconBtn @click="deleteItem(index)">
                                <VIcon icon="tabler-trash" />
                            </IconBtn>
                        </div>
                    </template>
                    <template #bottom>
                        <hr>
                    </template>
                </VDataTable>
                <VCol class="text-right" md="12">
                    <VBtn @click="addItem"> + add new </VBtn>
                </VCol>
            </VCardText>
            <VCardText class="button-container">
                <VBtn @click="handleFormSubmit" color="success">บันทึก</VBtn>
            </VCardText>
        </VForm>
    </VCard>
</template>

<script setup>
import { router } from "@/plugins/1.router";
import axios from "axios";
import { useRoute } from 'vue-router';
import { VForm } from "vuetify/components/VForm";
import sweetalertService from '../../../service/sweetalertService';

const route = useRoute();
const accessTokenCookie = useCookie('accessToken')
const userData = useCookie('userData')
console.log(userData.value.id);
const headers = {
    "Authorization": "Bearer " + accessTokenCookie.value
}
onMounted(async () => {
    route.params.id || null
    getData()

})
const trainingID = route.params.id
const refFormEB04Page1 = ref([])
const typeForm = ref("add");
const trainingGraduateId = ref("");

const headersEB04 = [
    { title: "ที่", value: "index" },
    { title: "ชื่อ-นามสกุล", value: "rotg_name" },
    { title: "หมายเลขบัตรประชาชน", value: "rotg_id_card" },
    { title: "ระดับการอบรม (Supervisor/Worker/Operator)", value: "rotg_level" },
    { title: "ตำแหน่ง", value: "rotg_role" },
    { title: "", value: "action" },
];

//แสดงข้อมูลแค่ 7 แถว
// const options = ref({
//     page: 1,
//     itemsPerPage: 7,
//     sortBy: [""],
//     sortDesc: [false],
// });

const dataEB04 = ref([
    {
        rotg_name: "",
        rotg_id_card: "",
        rotg_level: "",
        rotg_role: "",
        rotg_id_training: trainingID,
        rotg_type: "B"
    },
]);
const getData = async () => {
    const data = {
        // populate: ["tra_id_course"],
        where: {
            rotg_id_training: trainingID
        }
    }
    await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/get/eec_training_graduates`, data, { headers }
    ).then((result) => {
        if (result.data) {
            typeForm.value = "edit"
            // trainingGraduateId.value = data._id
            console.log('result.data')
            console.log(result.data)
            dataEB04.value = result.data
        }
    })
}
const addItem = () => {
    dataEB04.value.push({
        rotg_name: "",
        rotg_id_card: "",
        rotg_level: "",
        rotg_role: "",
        rotg_id_training: trainingID,
        rotg_type: "B"
    },);
};

const deleteItem = (index) => {
    dataEB04.value.splice(index, 1);
};


const backMainPage = () => {
    router.replace({
        name: 'type-bmanagement-training'
    })
};

const handleFormSubmit = async () => {
    let isValid = true
    await refFormEB04Page1.value?.validate().then((valid) => {
        if (!valid.valid) {
            isCurrentStepValid.value = false;
            isValid = false;
        }
    });
    console.log(isValid)
    saveTrainingGraduates(isValid);
};
const saveTrainingGraduates = async (valid) => {
    if (valid) {
        try {
            const result = await sweetalertService.showAlert(
                "คุณต้องการบันทึกข้อมูลหรือไม่ ?",
                "โปรดเลือกดำเนินการที่คุณต้องการ",
                "warning",
                "ยืนยัน",
                "ยกเลิก"
            );
            if (result.isConfirmed) {
                await save();
                await sweetalertService.showSuccessTimeOut(
                    "เสร็จสิ้น !",
                    "การบันทึกข้อมูลของคุณสำเร็จแล้ว."
                );
                backMainPage()
                // router.replace({ name: 'backMainPage' });
            } else {
                sweetalertService.showAlertTimeOut(
                    "ยกเลิก",
                    "ยกเลิกการบันทึกข้อมูลสำเร็จแล้ว",
                    "error"
                );
            }
        } catch (error) {
            sweetalertService.showErrorTimeOut("Error", "An error occurred.");
        }
    } else {
        sweetalertService.showAlertTimeOut(
            "กรุณากรอกข้อมูลให้ครบถ้วน",
            "",
            "error"
        );
    }
}

async function save() {
    try {
        if (typeForm.value == "edit") {
            // dataEB04.value.forEach(async (value, index) => {
            // console.log(index)
            // console.log(value)
            await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/bulkWrite/eec_training_graduates`, {
                data: dataEB04.value,
            }, { headers },)
            // });
            // dataEB04.value.rotg_id_training = trainingID
            // dataEB04.value.forEach(async value => {
            //     if (value._id) {
            //         await axios.put(
            //             `${import.meta.env.VITE_API_HOST}/mongoose/update/eec_training_graduates/${value._id}`, { data: value }, { headers }
            //         )
            //     } else {
            //         `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_training_graduates`, { data: value }, { headers }

            //     }

            // });
            const dataSet = {
                hcs_date: new Date().toISOString(),
                hcs_stasus_change: "updated training graduates",
                hcs_training_tra_id: dataEB04.value.rotg_id_training,
                // "hcs_training_tra_id": null,
                hcs_user: userData.value.id
            }
            await axios.post(
                `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
            )

        }
        if (typeForm.value == "add") {

            // dataEB04.value.tra_created_by = userData.value.id
            // dataEB04.value.tra_status_approve = "รออนุมัติ"
            // dataEB04.value.tra_comment_approve = ""
            dataEB04.value.rotg_id_training = trainingID
            await axios.post(
                `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_training_graduates`, { data: dataEB04.value }, { headers }
            )
            const dataSet = {
                hcs_date: new Date().toISOString(),
                hcs_stasus_change: "created training graduates",
                hcs_training_tra_id: dataEB04.value.rotg_id_training,
                // "hcs_training_tra_id": null,
                hcs_user: userData.value.id
            }

            await axios.post(
                `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
            )
            // console.log(data.data._id);
        }
    } catch (error) {

    }
}
</script>


<style>
.button-container {
    display: flex;
    justify-content: flex-end;
}

hr {
    border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
