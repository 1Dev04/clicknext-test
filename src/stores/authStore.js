import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('authStore', () => {
  const email = ref(localStorage.getItem('email') || '');
  const password = ref(localStorage.getItem('password') || '');
  const iSAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");

  
  // get users from localStorage (ถ้าไม่มีให้ใช้ค่าเริ่มต้น)


  // function Login
  const login = (userEmailL, passwordL, ) => {
   
    email.value = userEmailL;
    password.value = passwordL;
    iSAuthenticated.value = true;
    localStorage.setItem("email", userEmailL);
    localStorage.setItem("password", passwordL);
    localStorage.setItem("isAuthenticated", "true");
    console.log("เข้าสู่ระบบสำเร็จ");
        
    
  };

  // function logout
  const logout = () => {
    email.value = '';
    password.value = '';
    iSAuthenticated.value = false;
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("isAuthenticated");
  };

  return { email, password,  iSAuthenticated, login, logout };
});