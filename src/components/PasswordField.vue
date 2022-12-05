<template>
    <div class="form-group py-2">
        <div class="input-field"> <span class="fa fa-lock p-2"></span> 
            <input
             v-if="showPassword"
            type="text"
            placeholder="Password"
            autocomplete="off"
            @input="$emit('update:modelValue', $event.target.value)"
            v-model="input"
            @keyup="validateInput"
            @blur="validateInput"
            />
            <input
            v-else
            type="password"
            placeholder="Password"
            autocomplete="off"
            @input="$emit('update:modelValue', $event.target.value)"
            v-model="input"
            @keyup="validateInput"
            @blur="validateInput"
            />
            <a class="btn bg-white text-muted"  @click="ShowToggle"> 
              <span class="far"  :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></span> 
            </a> 
        </div>
        <div class="ui basic label pointing red" v-if="errors.password">
            {{ errors.password }}
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import useFormValidation from "../modules/useFormValidation";
export default {
  setup() {
    let input = ref("");
    let showPassword = ref(false);
    const { validatePasswordField, errors } = useFormValidation();
    const validateInput = () => {
      validatePasswordField("password", input.value);
    };
    function ShowToggle () {
              showPassword.value = !showPassword.value;
        }
    return { 
      input, 
      errors, 
      validateInput,
      ShowToggle,
      showPassword};
  },
};
</script>