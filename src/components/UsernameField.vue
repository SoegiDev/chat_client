<template>
    <div class="form-group py-2">
        <div class="input-field"> <span class="far fa-user p-2"></span> 
       <input
        type="text"
        placeholder="User Name"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
        v-model="input"
        @keyup="validateInput"
        @blur="validateInput"
      />
    </div>
        <div class="ui basic label pointing red" v-if="errors.username">
            {{ errors.username }}
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import useFormValidation from "../modules/useFormValidation";
export default {
  setup() {
    let input = ref("");
    const { validateuserNameField, errors } = useFormValidation();
    const validateInput = () => {
      validateuserNameField("username", input.value);
    };
    return { input, errors, validateInput };
  },
};
</script>