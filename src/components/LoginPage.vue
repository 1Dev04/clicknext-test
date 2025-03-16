<script setup> 
import { ref } from 'vue';

// set Empty ref(สร้างค่าที่สามารถเปลี่ยนแปลงได้)
const email = ref(''); 
const password = ref('');

// กำหนด Regex (Email)
const emailPattern = (value) => {
    const emailRegex = /^[\w0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
};

// กำหนด Regex (password)
const passwordPattern = (value) => {
    const containsUppercase = /[A-Z]/.test(value) // ต้องมี A-Z อย่างน้อย 1 ตัว
      const containsLowercase = /[a-z]/.test(value) // ต้องมี a-z อย่างน้อย 1 ตัว
      const containsNumber = /[0-9]/.test(value) //ต้องมีตัวเลข 0-9 อย่างน้อย 1 ตัว
      const containsSpecial = /[#?!@$%^&*-]/.test(value) // ต้องมีอักขระพิเศษ อย่างน้อย 1 ตัว
      return containsUppercase && containsLowercase && containsNumber && containsSpecial;
};
 
// Alert message email and password
const login = () => {
    if (email.value === "" && password.value === "") {
        alert("Please enter your email and password. ❌");
    } else if (email.value === "") {
        alert("Please enter your email. ❌");
    } else if (!emailPattern(email.value)) {
        alert("Invalid email format. Please enter a valid email. ❌");
    } else if (!passwordPattern(password.value)) {
        alert("Password must contain at least: \n- 1 uppercase letter \n- 1 lowercase letter \n- 1 number \n- 1 special character (#?!@$%^&*-) ❌"); 
    } else if (password.value === "") {
        alert("Please enter your password. ❌");
    } else {
        alert("Login successful. 🎉");
       
    }
 
};

</script>



<template>
    <!-- จัดการ layout กำหนดภายในเป็นแนวตั้ง จัดให้อยู่กึ่งกลาง สูงเต็มจอ -->
    <div class="d-flex flex-column  justify-content-center vh-100">
        <!-- กำหน้ดให้อยู่ฝั่งซ้าย -->
        <h6 class="align-self-start">Email *</h6>
        <!-- กำหนดสไตล์ กำหนดระยะของบรรทัด -->
        <input v-model="email" type="email" class="form-control mb-4" placeholder="Username" maxlength="50" />
        <h6 class="align-self-start">Password *</h6>
        <input v-model="password" type="password" class="form-control mb-4" placeholder="Password" maxlength="20"/>
        <button @click="login"  class="btn btn-dark">Login</button>
    </div>

</template>

<style>
#app {
    /* font */
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    /* จัดให้อยู่กึ่งกลาง  */
    text-align: center;
    justify-content: center;
    /* กลางแนวตั้ง  */
    align-items: center;
    /* กลางแนวนอน */
    height: 500px;
    /* container สูงเต็มจอ */
    color: #000000;
    /* ระยะห่างด้านบน */
    margin-top: 100px;
}
</style>




