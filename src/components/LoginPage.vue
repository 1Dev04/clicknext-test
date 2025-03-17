<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // ดึง Store มาใช้
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

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
    const containsUppercase = /[A-Z]/.test(value); // ต้องมี A-Z อย่างน้อย 1 ตัว
    const containsLowercase = /[a-z]/.test(value); // ต้องมี a-z อย่างน้อย 1 ตัว
    const containsNumber = /[0-9]/.test(value); // ต้องมีตัวเลข 0-9 อย่างน้อย 1 ตัว
    const containsSpecial = /[#?!@$%^&*-]/.test(value); // ต้องมีอักขระพิเศษ อย่างน้อย 1 ตัว
    return containsUppercase && containsLowercase && containsNumber && containsSpecial;
};

// Alert message email and password
const login = () => {
    if (email.value === "" && password.value === "") {
        alert("กรุณากรอกอีเมล์และรหัสผ่านของคุณ ❌");
    } else if (email.value === "") {
        alert("กรุณากรอกอีเมล์ของคุณ ❌");
    } else if (!emailPattern(email.value)) {
        alert("รูปแบบอีเมล์ไม่ถูกต้อง กรุณาใส่อีเมล์ที่ถูกต้อง ❌");
    } else if (password.value === "") {
        alert("กรุณากรอกรหัสผ่านของคุณ ❌");
    } else if (!passwordPattern(password.value)) {
        alert("รหัสผ่านต้องประกอบด้วยอย่างน้อย: \n- อักษรตัวพิมพ์ใหญ่ 1 ตัว \n- อักษรตัวพิมพ์เล็ก 1 ตัว \n- ตัวเลข 1 ตัว \n- อักขระพิเศษ 1 ตัว (#?!@$%^&*-) ❌"); 
    } else {
        alert("การเข้าสู่ระบบสำเร็จแล้ว 🎉");
        authStore.login(email.value, password.value);
        router.push('/deposit-withdraw');
    }
};

// คืนค่าตัวแปรให้ Vue ใช้
</script>

<template>
    <div class="login-container">
         <!-- จัดการ layout กำหนดภายในเป็นแนวตั้ง จัดให้อยู่กึ่งกลาง สูงเต็มจอ -->
    <div class="d-flex flex-column justify-content-center vh-100">
        <!-- กำหนดให้อยู่ฝั่งซ้าย -->
        <h6 class="align-self-start">Email *</h6>
        <!-- กำหนดสไตล์ กำหนดระยะของบรรทัด -->
        <input v-model="email" type="email" class="form-control mb-4" placeholder="Username" maxlength="50" />
        <h6 class="align-self-start">Password *</h6>
        <input v-model="password" type="password" class="form-control mb-4" placeholder="Password" maxlength="20"/>
        <button @click="login" class="btn btn-dark">Login</button>
    </div>
    </div>
   
</template>

<style scoped>
.login-container{
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