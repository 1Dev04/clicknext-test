import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('authStore', () => {
  const email = ref(localStorage.getItem('email') || '');
  const iSAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");

  
  // get users from localStorage (ถ้าไม่มีให้ใช้ค่าเริ่มต้น)
  const users = ref(JSON.parse(localStorage.getItem("users")) || [
    { email: "12345admin@gmail.com", password: "Admin@12345" },
  ]);

  // function Login
  const login = (userEmail, password) => {
    const user = users.value.find(u => u.email === userEmail && u.password === password);

    // check login
    if (user) {
        email.value = userEmail;
        iSAuthenticated.value = true;
        localStorage.setItem("email", userEmail);
        localStorage.setItem("isAuthenticated", "true");
    } else {
        alert("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  // function logout
  const logout = () => {
    email.value = '';
    iSAuthenticated.value = false;
    localStorage.removeItem("email");
    localStorage.removeItem("isAuthenticated");
  };

  // function Register 

  const register = (newEmail, newPassword) => {
    const exists = users.value.some(user => user.email === newEmail);
    if (exists) {
        alert("❌ อีเมลนี้ถูกใช้ไปแล้ว");
        return;
    }

    users.value.push({ email: newEmail, password: newPassword });
    localStorage.setItem("users", JSON.stringify(users.value));
    alert("✅ ลงทะเบียนสำเร็จ!");
  };

  return { email, iSAuthenticated, login, logout, register };
});