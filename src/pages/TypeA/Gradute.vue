<template>
  <div>
    <VCard class="mt-5">
      <template v-slot:title>
        <div class="d-flex">
          <h3 class="bold">{{ $t('graduate.manageGraduateData') }}</h3>
        </div>
      </template>
      <hr />
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <AppTextField v-model="search" placeholder="|ค้นหา" prepend-inner-icon="tabler-search" single-line
              hide-details dense outlined />
          </VCol>
          <VCol cols="12" md="2" class="text-right">
            <AppAutocomplete v-model="filterSelect" :items="filterSearch" :custom-filter="customFilter"
              placeholder="ตำแหน่ง" />
          </VCol>
          <VCol class="d-flex justify-end gap-5">
            <a href="../../../src/assets/fileExcel/exampleFilee.xlsx" download="exampleFile.xlsx" class="icon-btn">
              <VIcon icon="tabler-file-download" />
              <VTooltip open-delay="500" location="top">
                <span>ตัวอย่างไฟล์นำเข้า</span>
              </VTooltip>
            </a>
            <!-- <IconBtn>
              <VIcon icon="tabler-file-download" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>ตัวอย่างไฟล์นำเข้า</span>
              </VTooltip>
            </IconBtn> -->
            <VBtn color="info" @click="isDialogVisible = true"> {{ $t('button.addByFile') }} </VBtn>

            <VDialog v-model="isDialogVisible" max-width="30vw">
              <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
              <VCard :title="$t('graduate.addGraduateByFile')">
                <VForm ref="File">
                  <VCardText>
                    <VFileInput label="เลือกไฟล์"
                      accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      @change="handleFileUpload" :rules="[requiredValidator]">
                    </VFileInput>
                  </VCardText>
                  <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn @click="uploadData"> {{ $t('button.save') }} </VBtn>
                  </VCardText>
                </VForm>
              </VCard>
            </VDialog>

            <VBtn color="info" @click="() => $router.push({ name: 'type-aadd-graduate', params: { id: id.value } })">
              {{ $t('button.increaseData') }}
            </VBtn>
          </VCol>
        </VRow>

      </VCardText>
      <hr />
      <VDataTable :headers="headers" :search="search" :items="Graduates" :items-per-page="options.itemsPerPage"
        :page="options.page" :options="options">
        <!-- <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template> -->
        <template #bottom>
          <hr />

          <VCardText class="pt-2">
            <div class="footer-paginate">
              <span>{{ $t('graduate.amount : ') }}</span>
              <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
                style="max-width: 4vw" class="ms-2 me-2" />
              <span class="me-2">{{ $t('graduate.rowPerPage') }} :</span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 1 : 3"
                :length="Math.ceil(Graduates.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>
<script setup lang="js">
import { router } from "@/plugins/1.router";
import { ref, onMounted } from "vue";
import axios from 'axios';
import ExcelJS from 'exceljs';
import sweetalertService from '../../../service/sweetalertService';
import { requiredValidator } from "@/@core/utils/validators";
import { VForm } from "vuetify/components/VForm";
import Papa from 'papaparse';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const route = useRoute();


const id = ref(route.params.id);
const search = ref("");

const File = ref(null);
const excelData = ref([
]);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  console.log(file)
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
    const nameParts = row[1].split(' ');
    const prefix = nameParts[0];
    const firstname = nameParts[1];
    const lastname = nameParts[2];

    return {
      rotg_prefix: prefix,
      rotg_firstname: firstname,
      rotg_lastname: lastname,
      rotg_id_card: row[2],
      rotg_level: row[3],
      rotg_role: row[4],
      rotg_id_training: id.value, // Fixed value
      rotg_type: "A",
    };
  }).filter(row => row !== null); // Remove null values from the array
  const existingData = await fetchExistingData();

  // ตรวจสอบข้อมูลซ้ำ
  const duplicates = data.filter(newEntry =>
    existingData.some(existingEntry =>
      existingEntry.rotg_id_card === newEntry.rotg_id_card
    )
  );

  if (duplicates.length > 0) {
    const duplicateMessages = duplicates.map(item =>
      `ID Card: ${item.rotg_id_card}, Name: ${item.rotg_firstname} ${item.rotg_lastname}`
    ).join('\n');
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.foundDuplicateInformation"),
      `${duplicateMessages}`,
      "warning",
    )
  }

  excelData.value = data;
  console.log(excelData.value)
};


      //  && `${existingItem.rotg_prefix} ${existingItem.rotg_firstname} ${existingItem.rotg_lastname}` === `${newItem.rotg_prefix} ${newItem.rotg_firstname} ${newItem.rotg_lastname}`

const readCSVFile = async (file) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const csvData = event.target.result
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    }).data.map(row => {
      const nameParts = row['Name'].split(' ');
      const prefix = nameParts.length > 2 ? nameParts[0] : ''; // คำนำหน้า
      const firstname = nameParts.length > 1 ? nameParts[1] : nameParts[0]; // ชื่อ
      const lastname = nameParts.length > 2 ? nameParts[2] : nameParts[1] || '';
      return {
        rotg_prefix: prefix,
        rotg_firstname: firstname,
        rotg_lastname: lastname,
        rotg_id_card: row['ID_Card'],
        rotg_level: row['Level'],
        rotg_role: row['Role'],
        rotg_id_training: id.value,
        rotg_type: "A",
      };
    });
    const existingData = await fetchExistingData();

    // ตรวจสอบข้อมูลที่ซ้ำกัน
    const duplicates = parsedData.filter(newItem =>
      existingData.some(existingItem =>
        existingItem.rotg_id_card === newItem.rotg_id_card 
      )
    );

    if (duplicates.length > 0) {
      const duplicateMessages = duplicates.map(item =>
        `ID Card: ${item.rotg_id_card}, Name: ${item.rotg_firstname} ${item.rotg_lastname}`
      ).join('\n');
      sweetalertService.showAlertTimeOut(
        t("sweetAdd.foundDuplicateInformation"),
        `${duplicateMessages}`,
        "warning",
      );
      // alert(`พบข้อมูลซ้ำ:\n${duplicateMessages}`);
    }

    excelData.value = parsedData
    console.log(excelData.value);
  };
  reader.readAsText(file)
}

const fetchExistingData = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/get/eec_training_graduates`,
      {
        where: {
          rotg_id_training: id.value
        }
      },
      { headers }
    );

    return response.data; // คืนข้อมูลที่มีอยู่
  } catch (error) {
    console.error('Error fetching existing data:', error);
    return [];
  }
};

const uploadData = async () => {
  const isValid = await validateGraduateForm();
  if (!isValid) {
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.unableToAddData"),
      t("sweetAdd.pleaseInputACompleteData"),
      "error",
      t("button.confirm"),
      t("button.cancel")
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

      const accessTokenCookie = useCookie('accessToken')
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      }
      sweetalertService.showSuccessTimeOut(
        t("sweetAdd.complete"),
        t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
      );
      await axios
        .post(`${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_training_graduates`, {
          data: excelData.value
        }, { headers },
        )
      isDialogVisible.value = false;
      getGraduates();
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetAdd.cancel"),
        t("sweetAdd.successfullyCanceledDataIncrease"),
        "error"
      );
    }
  } catch (error) {
    sweetalertService.showErrorTimeOut("Error", "An error occurred.");
  }
};


const validateGraduateForm = async () => {
  try {
    const valid = await File.value?.validate();
    File.value = valid.valid;
    return valid.valid;
  } catch (error) {
    File.value = false;
    return false;
  }
};

// const downloadExampleFile = () => {
//   const fileUrl = '@/assets/fileExcel/example-file.xlsx'; // Path to your file

//   axios.get(fileUrl, { responseType: 'blob' })
//     .then(response => {
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'example-file.xlsx'); // Set your desired filename here
//       document.body.appendChild(link);
//       link.click();
//       link.remove(); // Clean up
//     })
//     .catch(error => {
//       console.error('Error downloading file:', error);
//     });
// }

//ตัวแปรสำหรับ Paginate
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const isDialogVisible = ref(false);

const fullName = ref();



const headers = computed(() => [
  { title: t("graduate.header.name"), key: "rotg_fullname" },
  { title: t("graduate.header.ID-Card"), key: "rotg_id_card" },
  { title: t("graduate.header.level"), key: "rotg_level" },
  { title: t("graduate.header.role"), key: "rotg_role" },
]);

const combineName = (graduate) => {
  fullName.value = graduate.rotg_prefix;
  console.log(graduate)
};


const Graduates = ref([]);
const filterSearch = ref([]);
const filterSelect = ref();

const filterRole = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    const response = await axios
      .post(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/Taining`, {
        where:
        {
          rotg_id_training: id.value
        }
      },
        { headers }
      );
    if (Array.isArray(response.data)) {
      const role = new Set(response.data.map(item => item.rotg_role));
      filterSearch.value = ["ทั้งหมด", ...role];
    } else {
      console.log(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}


const getGraduates = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };

    let where = {};
    if (filterSelect.value && filterSelect.value !== 'ทั้งหมด') {
      where.rotg_role = filter.value;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/get/eec_training_graduates`,
      {
        populate: ['rotg_id_training'],
        where: {
          rotg_id_training: id.value,
          ...where
        }
      },
      { headers }
    );
    Graduates.value = response.data;
    combineName(Graduates.value);
    console.log(response)
    if (response.data && Array.isArray(response.data)) {
      Graduates.value = response.data.map(graduate => {
        // รวมชื่อเต็ม
        const fullName = `${graduate.rotg_prefix}${graduate.rotg_firstname} ${graduate.rotg_lastname}`.trim();
        return {
          ...graduate,
          rotg_fullname: fullName // เพิ่มฟิลด์ใหม่ชื่อ rotg_fullname
        };
      });
    } else {
      Graduates.value = [];
    }

  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  getGraduates(),
    filterRole()
})
</script>

<style lang="scss">
.radio {
  display: flex;
  align-content: space-between;
  justify-content: center;
}

.footer-paginate {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px;
  justify-content: flex-end;
}

// .footer {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }

.swal2-container {
  z-index: 2500 !important;
  /* เพิ่มค่า z-index ให้สูงพอที่จะอยู่ด้านหน้าของ dialog */
}

hr {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
