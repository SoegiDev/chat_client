<template>
    <div class="form-group py-2">
        <div class="input-field"> <span class="far fa-user p-2"></span> 
        <label class="radio" v-for="(gender, index) in genders" :key="index">
          <input type="radio" :value="gender.code" 
            @input="$emit('update:modelValue', $event.target.value)"
          v-model="input" @click="selectedGender(gender.code)" />
          {{ gender.description }}
        </label>
    </div>
        <div class="ui basic label pointing red" v-if="errors.gender">
            {{ errors.gender }}
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import useFormValidation from "../modules/useFormValidation";
export default {
  setup() {
    let input = ref("");
    const genders = ref([{
          code: "female",
          description: "Female",
        },
        {
          code: "male",
          description: "Male",
        }])
    const { validateGenderField, errors } = useFormValidation();
    const validateInput = () => {
      validateGenderField("gender", input.value);
    };
    function selectedGender(option) {
      input.value = option;
      console.log(option)
    }
    return { input, errors, validateInput,genders,selectedGender };
  },
};
</script>