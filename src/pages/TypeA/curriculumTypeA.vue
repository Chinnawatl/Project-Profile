<template>
  <VCard class="mt-5">
    <template v-slot:title>
      <div class="d-flex">
        <h3>{{ $t('curriculum.Courses') }}</h3>
      </div>
    </template>
    <hr />
    <VCardText>
      <VRow>
        <VCol cols="12" md="2" class="text-right">
          <AppTextField v-model="search" placeholder="|ค้นหา" prepend-inner-icon="tabler-search" single-line
            hide-details dense outlined />
        </VCol>
        <VCol cols="12" md="2" class="text-right">
          <AppAutocomplete v-model="selectedOptionAcademy" :items="typeAcademy" placeholder="สถานศึกษา" />
        </VCol>
        <VCol cols="12" md="2" class="text-right">
          <AppAutocomplete v-model="selectedOptionName" :items="typeName" placeholder="หลักสูตร" />
        </VCol>
        <VCol cols="12" md="2" class="text-left">
          <VBtn variant="outlined" color="warning" @click="clearFilters">
            {{ $t('button.clear') }}
          </VBtn>
        </VCol>
          <VDialog v-model="isDialogVisible" max-width="600">
            <!-- Dialog Activator -->
            <template #activator="{ props }">
              <VCol class="d-flex justify-end gap-5">
                <a href="../../../src/assets/fileExcel/typeA.xlsx" download="typeA.xlsx" class="icon-btn">
                  <IconBtn>
                    <VIcon icon="tabler-file-download" />
                    <VTooltip open-delay="100" location="top" activator="parent">
                      <span>{{ $t('button.exampleImportFile') }}</span>
                    </VTooltip>
                  </IconBtn>
                </a>
                <VBtn v-bind="props" color="info">{{ $t('curriculum.ImportFile') }}</VBtn>
                <VDialog v-model="isDialogVisible" max-width="30vw">
                  <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
                  <VCard title="Add information from a file">
                    <VForm ref="refFile">
                      <VCardText>
                        <VFileInput label="Select file"
                          accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          @change="checkFileUpload" :rules="[requiredValidator]">
                        </VFileInput>
                      </VCardText>
                      <VCardText class="d-flex justify-end flex-wrap gap-3">
                        <VBtn @click="addCurriculumByFile"> Save </VBtn>
                      </VCardText>
                    </VForm>
                  </VCard>
                </VDialog>

                <VBtn color="info" @click="() => $router.push({ name: 'type-aadd-curriculum' })">{{ $t('curriculum.Add')
                  }}</VBtn>
              </VCol>
            </template>
          </VDialog>
      </VRow>
    </VCardText>
    <hr />
    <VDataTable :headers="headers" :items="curriculumTypeA" :search="search" :items-per-page="options.itemsPerPage"
      :page="options.page" :options="options">
      <template #bottom>
        <hr />
        <VCardText class="pt-2">
          <div class="footer-paginate">
            <span>{{ $t('paginate.amount') }}</span>

            <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
              style="max-inline-size: 4vw;" class="ms-2 me-2" />
            <span class="me-2">{{ $t('paginate.rowPerPage') }}</span>
            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 1 : 3"
              :length="Math.ceil(curriculumTypeA.length / options.itemsPerPage)" />
          </div>
        </VCardText>
      </template>
      <template #item.action="{ item }">
        <div class="d-flex justify-center">
          <VMenu activator="parent" location="bottom" origin="top">
            <template v-slot:activator="{ on, attrs }">
              <VBtn icon variant="text" color="medium-emphasis" v-bind="attrs" v-on="on">
                <VIcon icon="tabler-dots-vertical" />
                <VTooltip open-delay="100" location="top" activator="parent">
                  <span>{{ $t('curriculum.tabler') }}</span>
                </VTooltip>

              </VBtn>
            </template>
            <VList>
              <VListItem @click="showCourseDetail(item)">
                <template #prepend>
                  <VIcon icon="tabler-eye" />
                </template>
                <span>{{ $t('curriculum.eye') }}</span>
              </VListItem>

              <VListItem @click="editItem(item._id)">
                <template #prepend>
                  <VIcon icon="tabler-edit" />
                </template>
                <span>{{ $t('curriculum.edit') }}</span>
              </VListItem>

              <VListItem @click="addItem(item._id)">
                <template #prepend>
                  <VIcon icon="tabler-user-plus" />
                </template>
                <span>{{ $t('curriculum.user') }}</span>
              </VListItem>

              <VListItem @click="deleteItem(item._id)">
                <template #prepend>
                  <VIcon icon="tabler-trash" />
                </template>
                <span>{{ $t('curriculum.trash') }}</span>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </template>
    </VDataTable>


    <!-- Course Detail Dialog -->
    <VDialog v-model="isViewDialogOpen" max-width="70vw">
      <VCard>
        <template v-slot:title>
          <div class="view-data">
            <div>
              <h3 class="">
                {{ $t('curriculum.courseDetails') }}
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
            <VCol cols="12" md="6">
              <AppTextField v-model="selectedCourse.typa_academy" :label="$t('curriculum.formTypeA.Institution')"
                readonly />
            </VCol>

            <VCol cols="12" md="6">
              <AppTextField v-model="selectedCourse.typa_name" :label="$t('curriculum.formTypeA.Course')" readonly />
            </VCol>

            <VCol cols="12" md="6">
              <AppTextarea v-model="selectedCourse.typa_detail" :label="$t('curriculum.formTypeA.Description')" rows="3"
                readonly />
            </VCol>

            <VCol cols="12" md="6">
              <AppTextarea v-model="selectedCourse.typa_goal" :label="$t('curriculum.formTypeA.Objective')" rows="3"
                readonly />
            </VCol>

            <VCol cols="12" md="6">
              <AppTextarea v-model="selectedCourse.typa_level" :label="$t('curriculum.formTypeA.ContentLevel')" rows="3"
                readonly />
            </VCol>

            <VCol cols="12" md="6">
              <AppTextarea v-model="selectedCourse.typa_structure" :label="$t('curriculum.formTypeA.CourseStructure')"
                rows="3" readonly />
            </VCol>

            <VCol cols="12">
              <AppCombobox v-model="selectedCourse.typa_skill_set" :label="$t('curriculum.formTypeA.Skills')" chips
                multiple readonly />
            </VCol>
          </VRow>
        </VCardText>
        <hr>
        <VCardText>
          <VRow>
            <VCol md="6" offset-md="6" class="text-right">
              <VBtn color="primary" variant="tonal" @click="editItem(selectedCourse._id)">
                <VIcon icon="tabler-edit" start />
                {{ $t('button.editData') }}
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>

</template>

<script setup lang="js">
import axios from 'axios';
import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import sweetalertService from "../../../service/sweetalertService";
import { useI18n } from 'vue-i18n';
const userDataCookie = useCookie('userData')
const user_firstname = userDataCookie.value.FIRST_NAME
const { t } = useI18n();

// const route = useRoute();
const router = useRouter();
const refFile = ref(null);
const excelData = ref([]);
const search = ref("");

const validateCurriculumFile = () => {
  return refFile.value?.validate().then(valid => {
    if (valid.valid) {
      refFile.value = true;
    } else {
      refFile.value = false;
    }
    return refFile.value;
  });
};

const checkFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file.name.endsWith('.xlsx')) {
    await readXLSXFile(file);
  } else if (file.name.endsWith('.csv')) {
    await readCSVFile(file);
  }
};

const readXLSXFile = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  const worksheet = workbook.worksheets[0];

  const data = worksheet.getSheetValues().slice(1).map((row, index) => {
    if (index === 0) return null;
    return {
      typa_name: row[2],
      typa_detail: row[3],
      typa_goal: row[4],
      typa_level: row[5],
      typa_structure: row[6],
      typa_skill_set: row[7] ? row[7].split(',').map(item => item.trim()) : [],
      typa_coordinator: user_firstname,
      typa_academy: row[1],
    };
  }).filter(row => row !== null); // Remove null values from the array
  excelData.value = data;
};

const readCSVFile = async (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const csvData = event.target.result
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    }).data.map(row => {
      return {
        typa_name: row['Course'],
        typa_detail: row['Description'],
        typa_goal: row['Objective'],
        typa_level: row['Content level'],
        typa_structure: row['Course structure'],
        typa_skill_set: row['Skills'] ? row['Skills'].split(',').map(item => item.trim()) : [],
        typa_coordinator: user_firstname,
        typa_academy: row['Institution'],
      };
    });
    excelData.value = parsedData
    // console.log(excelData.value);
  };
  reader.readAsText(file)
}

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
      await editStatusDelete(item)
      getCurriculumTypeA()
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

const addCurriculumByFile = async () => {
  // Add your form submission logic here
  const isValid = await validateCurriculumFile();
  if (!isValid) {
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.unableToAddData"),
      t("sweetAdd.pleaseInputACompleteData"),
      "error",
    );
    return;
  }
  try {
    const result = await sweetalertService.showAlert(
      t("sweetAdd.doYouWantToIncreaseData"),
      t("sweetAdd.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    if (result.isConfirmed) {
      // Add your form submission logic here
      const accessTokenCookie = useCookie('accessToken')
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      }
      try {
        await axios
          .post(`${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_type_a`, {
            data: excelData.value,
          }, { headers },)
          .then((result) => {
            console.log(result)
            sweetalertService.showSuccessTimeOut(
              t("sweetAdd.complete"),
              t("sweetAdd.yourDataHasBeenSuccessfullyIncreased"),
            );
            isDialogVisible.value = false;
            router.replace({ name: 'type-acurriculum-type-a' });
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.log(error)
      }

    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetAdd.cancel"),
        t("sweetAdd.successfullyCanceledDataIncrease"),
        "error"
      );
    }
  } catch (error) {
    sweetalertService.showErrorTimeOut("Error", "An error occurred.");
    console.error(error);
  }
};



const headers = computed(() => [
  { title: t('curriculum.header.Course'), key: "typa_name", width: '400px' },
  { title: t('curriculum.header.Institution'), key: "typa_academy", width: '400px' },
  { title: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + t('curriculum.header.action'), key: "action", align: 'center', width: '200px' },
]);

const curriculumTypeA = ref([
  {
    typa_name: "",
    typa_academy: "",
    typa_detail: '',
    typa_goal: '',
    typa_level: '',
    typa_structure: '',
    typa_skill_set: [],
  },
]);


const getCurriculumTypeA = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    let where = {
      typa_status: { $ne: 'Delete' }
    };
    if (selectedOptionAcademy.value && selectedOptionAcademy.value !== 'ทั้งหมด') {
      where.typa_academy = selectedOptionAcademy.value;
    }

    if (selectedOptionName.value && selectedOptionName.value !== 'ทั้งหมด') {
      where.typa_name = selectedOptionName.value;
    }

    // ส่งค่า where เป็น body ในการ post ไปยัง API
    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_type_a`, {
      where: where,
    }, { headers });
    // อัพเดตค่า curriculumTypeA.value ด้วยผลลัพธ์ที่ได้
    curriculumTypeA.value = result.data;
    // console.log("data:" + curriculumTypeA.value)
  } catch (error) {
    console.error(error);
  }
};

const editItem = (id) => {
  router.push({
    name: 'type-aedit-curriculum',
    params: {
      id: id
    }
  })
};

const addItem = (item) => {
  router.push({ name: 'type-agradute', params: { id: item } });
  console.log(item);
};


const editStatusDelete = async (id) => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_type_a/${id}`, {
      data: {
        typa_status: 'Delete'
      },
    }, { headers })
  } catch (error) {
    console.log(error);
  }
}


const showCourseDetail = (item) => {
  selectedCourse.value = item;
  isViewDialogOpen.value = true;
};

const closeViewDialog = () => {
  isViewDialogOpen.value = false;
};

const isDialogVisible = ref(false);
const isViewDialogOpen = ref(false);
const selectedCourse = ref(null);

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
// ----------------------------------------------------


const selectedOptionAcademy = ref();
const typeAcademy = ref([]);

const selectedOptionName = ref();
const typeName = ref([]);


const getFilter = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/TypeA`, { headers });
    console.log(response)
    if (Array.isArray(response.data)) {
      const activeData = response.data.filter(item => item.typa_status != 'Delete');

      // Extract unique academies and course names
      const academy = new Set(activeData.map(item => item.typa_academy));
      typeAcademy.value = ["ทั้งหมด", ...academy];

      const name = new Set(activeData.map(item => item.typa_name));
      typeName.value = ["ทั้งหมด", ...name];

    } else {
      console.error("Response data is not an array", response.data);
    }
  } catch (error) {
    console.log(error);
  }
}

const clearFilters = () => {
  selectedOptionAcademy.value = null;
  selectedOptionName.value = null;
  getCurriculumTypeA();
  
};

watch([selectedOptionAcademy, selectedOptionName], () => {
  if (!selectedOptionAcademy.value && !selectedOptionName.value) {
    getCurriculumTypeA(); // ทำให้ข้อมูลในตารางหายไปเมื่อฟิลเตอร์ว่างเปล่า
  } else {
    getCurriculumTypeA();
  }
});

onMounted(() => {
  getFilter();
  getCurriculumTypeA();
});
// onMounted(async () => {
//   await getFilter();
//   getCurriculumTypeA();
// });

const requiredValidator = (value) => !!value || 'Required.';

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

.cursor-pointer {
  cursor: pointer;
}

.view-data {
  display: flex;
  justify-content: space-between;
  margin-block-end: 2vh;
}

.swal2-container {
  z-index: 2500 !important;

  /* เพิ่มค่า z-index ให้สูงพอที่จะอยู่ด้านหน้าของ dialog */
}
</style>
