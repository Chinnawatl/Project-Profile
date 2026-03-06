<template>
  <VCard>
    <template v-slot:title>
      <div class="d-flex">
        <h3 class="">
          {{ $t('curriculum.AddCourse') }}
        </h3>
      </div>
    </template>
    <hr />
    <VCardText>
      <VForm ref="refCurriculumForm" @submit.prevent="addOrEditCurriculum">
        <VRow>

          <VCol cols="12" md="6">
            <AppTextField v-model="curriculumForm.typa_academy" :rules="[requiredValidator]"
              :label="$t('curriculum.formTypeA.Institution')" @blur="showDropdownAcademy = false" @input="onInput('academy')" placeholder="กรอกข้อมูล..." />
            <div v-if="showDropdownAcademy" class="dropdown-container">
              <ul>
                <li v-for="option in filteredOptionsacademy" :key="option" @click="selectOptionacademy(option)">
                  {{ option }}
                </li>
                <li v-if="filteredOptionsacademy.length === 0" @click="addNewOption">
                  "{{ curriculumForm.typa_academy }}" ไม่พบข้อมูล เพิ่มข้อมูล
                </li>
              </ul>
            </div>
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="curriculumForm.typa_name" :rules="[requiredValidator]"
              :label="$t('curriculum.formTypeA.Course')" @input="onInput('name')" placeholder="กรอกข้อมูล..." />
            <div v-if="showDropdown" class="dropdown-container">
              <ul>
                <li v-for="option in filteredOptions" :key="option" @click="selectOption(option)">
                  {{ option }}
                </li>
                <li v-if="filteredOptions.length === 0" @click="addNewOption">
                  "{{ curriculumForm.typa_name }}" ไม่พบข้อมูล เพิ่มข้อมูล
                </li>
              </ul>
            </div>
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_detail" rows="3" placeholder="Description"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Description')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_goal" rows="3" placeholder="Objective"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Objective')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_level" rows="3" placeholder="Content level"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.ContentLevel')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_structure" rows="3" placeholder="Course structure"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.CourseStructure')" />
          </VCol>

          <VCol cols="12" md="6">
            <VCombobox v-model="curriculumForm.typa_skill_set" chips closable-chips multiple placeholder="Skills"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Skills')" />
          </VCol>

          <VCol cols="12" class="d-flex justify-center align-center gap-4">
            <VBtn type="reset" color="error" @click="cancelForm">
              {{ $t("curriculum.buttonCancel") }}
            </VBtn>
            <VBtn type="submit" color="success">
              {{ $t("curriculum.buttonSave") }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup lang="js">
import { requiredValidator } from "@/@core/utils/validators";
import axios from 'axios';
import { ref } from "vue";
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { VForm } from 'vuetify/components/VForm';
import sweetalertService from '../../../service/sweetalertService';

const { t } = useI18n();
const router = useRouter();
const userDataCookie = useCookie('userData')
const id = userDataCookie.value.FIRST_NAME


const curriculumForm = ref({
  typa_name: "",
  typa_academy: "",
  typa_detail: "",
  typa_goal: "",
  typa_level: "",
  typa_coordinator: id,
  typa_structure: "",
  typa_skill_set: [],
});


const refCurriculumForm = ref(null);
const refvalid = ref(true);

// 
const showDropdown = ref(false);
const showDropdownAcademy = ref(false)


const onInput = (value) => {
  console.log("Input value:", value);

  if (value === "name") {
    showDropdown.value = curriculumForm.value.typa_name.length > 0;
  } else if (value === "academy") {
    showDropdownAcademy.value = curriculumForm.value.typa_academy.length > 0;
  }
};


const options = ref([]); // ข้อมูลตัวเลือก
const optionsacademy = ref([]); // ข้อมูลตัวเลือก


// ฟังก์ชันในการกรองตัวเลือกที่ตรงกับข้อมูลที่พิม
const filteredOptions = computed(() => {
  return options.value.filter(option =>
    option.toLowerCase().includes(curriculumForm.value.typa_name.toLowerCase())
  );
});
const filteredOptionsacademy = computed(() => {
  console.log(optionsacademy.value);
  return optionsacademy.value.filter(option =>
    option.toLowerCase().includes(curriculumForm.value.typa_academy.toLowerCase())
  );
});
// 

const validatecurriculumForm = () => {
  return refCurriculumForm.value?.validate().then(valid => {
    if (valid.valid) {
      refvalid.value = true;
    } else {
      refvalid.value = false;
    }
    return refvalid.value;
  });
};

const cancelForm = () => {
  router.push({ name: "type-acurriculum-type-a" });
};
// 

let typeAForm = ref();

const addNewOption = () => {
  // if (!options.value.includes(inputValue.value)) {
  //   options.value.push(inputValue.value);
  //   selectOption(inputValue.value);
  // }
  showDropdown.value = false;
  typeAForm = "add"
};

// ฟังก์ชันในการเลือกตัวเลือก

const selectOptionacademy = async (option) => {
  curriculumForm.value.typa_academy = option;
  showDropdownAcademy.value = false;
  getCurriculumTypeA("academy");
};

const selectOption = async (option) => {
  console.log("selectOption")
  curriculumForm.value.typa_name = option;
  showDropdown.value = false;
  getCurriculumTypeA();
};

const getCurriculumTypeA = async (course) => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    if (curriculumForm.value.typa_name && curriculumForm.value.typa_academy) {
      let where = { typa_name: curriculumForm.value.typa_name, typa_academy: curriculumForm.value.typa_academy ,typa_status: { $ne: 'Delete' }};
      const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_type_a`, {
        where: where,
      }, { headers });
      if (result.data.length != 0) {
        const resultsweet = await sweetalertService.showAlert(
          t("curriculum.ThisinformationalreadyexistsWanttoeditit"),
          t("curriculum.Pleasechoosetheactionyouwant"),
          "warning",
          t("button.confirm"),
          t("button.cancel")
        );
        if (resultsweet.isConfirmed) {
          // await save();
          typeAForm = "edit"
          curriculumForm.value = result.data;
          await sweetalertService.showSuccessTimeOut(
            t("sweetAdd.complete"),
            t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
          );
          // backMainPage()
          // router.replace({ name: 'backMainPage' });
        } else {
          // console.log(123456)
          sweetalertService.showAlertTimeOut(
            t("sweetAdd.cancel"),
            t("sweetAdd.successfullyCanceledDataIncrease"),
            "error"
          );
        }
      }
    } else if (course === "academy") {
      let where = { typa_academy: curriculumForm.value.typa_academy };
      const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/TypeA`, {
        where: where,
      }, { headers });
      const name = result.data.map(item => item.typa_name);
      options.value = Array.from(new Set(name)); // Ensure uniqueness
      getCurriculumTypeA();

    }
  } catch (error) {
    console.error(error);
  }
};

const getFilter = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/TypeA`, { headers });
    if (Array.isArray(response.data)) {
      const name = response.data.map(item => item.typa_name);
      options.value = Array.from(new Set(name)); // Ensure uniqueness

      const academy = response.data.map(item => item.typa_academy);
      optionsacademy.value = Array.from(new Set(academy)); // Ensure uniqueness
    } else {
      console.error("Response data is not an array", response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await getFilter();
});
// 
const addOrEditCurriculum = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };

    // สร้าง where condition เพื่อค้นหาข้อมูลที่ตรงกันในฐานข้อมูล
    let where = {
      typa_name: curriculumForm.value.typa_name,
      typa_academy: curriculumForm.value.typa_academy
    };

    // ตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่
    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_type_a`, {
      where: where,
    }, { headers });

    if (result.data) {
      // ถ้ามีข้อมูลที่ตรงกันในฐานข้อมูล
      const userConfirmed = await sweetalertService.showAlert(
        t("curriculum.ThisinformationalreadyexistsWanttoeditit"),
        t("curriculum.Pleasechoosetheactionyouwant"),
        "warning",
        t("button.confirm"),
        t("button.cancel")
      );

      if (userConfirmed.isConfirmed) {
        await editCurriculumData(result.data._id); // แก้ไขข้อมูลที่ตรงกัน
        sweetalertService.showSuccessTimeOut(
          t("sweetEdit.complete"),
          t("sweetEdit.yourDataHasBeenSuccessfullyModified")
        );
      } else {
        sweetalertService.showAlertTimeOut(
          t("sweetAdd.cancel"),
          t("sweetAdd.successfullyCanceledDataModify"),
          "error"
        );
      }

    } else {
      // ถ้าไม่มีข้อมูลที่ตรงกันในฐานข้อมูล
      await addCurriculum(); // เพิ่มข้อมูลใหม่
    }

  } catch (error) {
    console.error(error);
    sweetalertService.showErrorTimeOut("Error", "An error occurred.");
  }
};

const addCurriculum = async () => {
  const isValid = await validatecurriculumForm();
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
      const accessTokenCookie = useCookie('accessToken')
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      };

      await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_type_a`, {
        data: curriculumForm.value,
      }, { headers });

      sweetalertService.showSuccessTimeOut(
        t("sweetAdd.complete"),
        t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
      );
      router.replace({ name: 'type-acurriculum-type-a' });
    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetAdd.cancel"),
        t("sweetAdd.successfullyCanceledDataIncrease"),
        "error"
      );
    }
  } catch (error) {
    console.error(error);
    sweetalertService.showErrorTimeOut("Error", "An error occurred.");
  }
};

const editCurriculumData = async (id) => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };

    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_type_a/${id}`, {
      data: curriculumForm.value
    }, { headers });
    router.replace({ name: 'type-acurriculum-type-a' });
  } catch (error) {
    console.error(error);
  }
};

</script>

<style lang="scss">
/* Container for the dropdown list */
.dropdown-container {
  position: relative;
}

/* Dropdown list styles */
.dropdown-container ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  /* Softer border color */
  border-radius: 6px;
  /* Slightly rounded corners */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  /* Softer shadow */
  background-color: #f9f9f9;
  /* Light background color */
  position: absolute;
  width: 100%;
  z-index: 1000;
  max-height: 200px;
  /* Adjust height as needed */
  overflow-y: auto;
  /* Enable scrolling if necessary */
}

/* List item styles */
.dropdown-container li {
  padding: 12px;
  /* Slightly more padding for better spacing */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 15px;
  /* Adjust font size as needed */
  color: #333;
  /* Darker text color for better readability */
}

/* Hover effect for list items */
.dropdown-container li:hover {
  background-color: #e6e6e6;
  /* Subtle hover background color */
  color: #000;
  /* Text color on hover */
}

/* Style for the "Add new option" item */
.dropdown-container li.add-new {
  color: #007bff;
  /* Blue color for the add new option */
  font-weight: bold;
}

/* Style for empty state */
.dropdown-container li.empty-state {
  color: #666;
  /* Grey color for empty state text */
  text-align: center;
  padding: 12px;
  font-style: italic;
}
</style>
