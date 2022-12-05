<template>
    <div class="form-group py-2">
        <div class="input-field"> <span class="far fa-envelope p-2"></span> 
       <input
        type="text"
        placeholder="Email"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
        v-model="input"
        @keyup="validateInput"
        @blur="validateInput"
      />
    </div>
        <div class="ui basic label pointing red" v-if="errors.email">
            {{ errors.email }}
        </div>
    </div>
</template>

 <script>
import { ref } from "vue";
import useFormValidation from "@/modules/useFormValidation";
export default {
  setup() {
    let input = ref("");
    const { validateEmailField, errors } = useFormValidation();
    const validateInput = () => {
      validateEmailField("email", input.value);
    };
    return { input, errors, validateInput };
  },
};
</script>
