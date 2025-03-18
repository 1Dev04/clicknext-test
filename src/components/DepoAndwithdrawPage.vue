<template>
  <!-- Section Navbar  -->
  <nav class="navbar navbar-expand-lg px-4 border border-black bg-transparent">
    <div class="container-fluid">
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <h3 class="mt-2">Clicknext</h3>
      <button @click="logout" class="btn btn-dark">Logout</button>
    </div>
  </nav>

  <!-- Section button choose page (big) -->
  <div class="d-none d-lg-block position-fixed vh-100 bg-body-tertiary p-5 text-center" style="width: 250px">
    <button type="button" @click="showDepoWith"
      :class="{ 'btn-dark text-white': currentView === 'depowith', 'btn-outline-dark': currentView !== 'depowith' }"
      class="btn btn-outline-dark border-0 mb-4 fw-bold w-100">
      Deposit /<br />Withdraw
    </button>
    <button type="button" @click="showTran"
      :class="{ 'btn-dark text-white': currentView === 'transaction', 'btn-outline-dark': currentView !== 'transaction' }"
      class="btn btn-outline-dark border-0 mb-4 fw-bold w-100">
      Transaction
    </button>
  </div>

  <!-- Section button choose page (smail) -->

  <div class="collapse navbar-collapse navbar-light bg-light fixed-top" id="navbarNav">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <button type="button" @click="showDepoWith"
        :class="{ 'btn-dark text-white': currentView === 'depowith', 'btn-outline-dark': currentView !== 'depowith' }"
        class="btn btn-outline-dark border-0 mb-4 mt-3 fw-bold w-50">
        Deposit /<br />Withdraw
      </button>

      <button type="button" @click="showTran"
        :class="{ 'btn-dark text-white': currentView === 'transaction', 'btn-outline-dark': currentView !== 'transaction' }"
        class="btn btn-outline-dark border-0 mb-4 fw-bold w-50">
        Transaction
      </button>
    </div>
  </div>

  <!-- container Deposit/Withdraw -->
  <div class="content" v-if="currentView === 'depowith'">
    <div
      class="container d-flex flex-column justify-content-center align-items-center mt-5 col-sm-10 col-md-10 col-lg-10 p-5">
      <div class="w-10 ">
        <h4 class="mt-5 text-center">
          จำนวนเงินคงเหลือ {{ transactionStore.balance }} บาท
        </h4>
        <h6 class="mt-5 align-self-start">จำนวนเงิน *</h6>
        <input v-model.number="amount" @input="validateAmount" class="form-control mb-4" type="number" min="0"
          max="100000" placeholder="กรอกจำนวนเงิน" />
      </div>
      <div class="d-flex justify-content-center gap-3 mt-3">
        <button type="button" class="btn btn-success fw-bold px-4" style="min-width: 100px"
          @click="openConfirmModal('ฝาก')">
          ฝาก
        </button>
        <button type="button" class="btn btn-danger fw-bold px-4" style="min-width: 100px"
          @click="openConfirmModal('ถอน')">
          ถอน
        </button>
      </div>
    </div>
  </div>

  <!-- Page TransactionPage -->
  <div class="content" v-if="currentView === 'transaction'">
    <div
      class="container d-flex flex-column justify-content-center align-items-center mt-5 col-sm-10 col-md-10 col-lg-10 p-5">
      <TransactionPage />
    </div>
  </div>

  <!-- Modal ยืนยัน -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content ">
      <h4>ยืนยันการ{{ transactionType }}</h4>
      <p>จำนวนเงิน {{ tempAmount.toLocaleString() }} บาท</p>
      <div class="button-set">
        <button @click="confirmDepoWith" class="btn btn-dark ">ยืนยัน</button>
        <button @click="showModal = false" class="btn btn-light ">ยกเลิก</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { Collapse } from "bootstrap";
import TransactionPage from "./TransactionPage.vue";
import { useTransactionStore } from "@/stores/useTransactionStore";

export default {
  components: { TransactionPage },
  setup() {
    const navbar = ref(null);
    const amount = ref(0);
    const balance = computed(() => transactionStore.balance); // ใช้ค่าจาก Store
    const currentView = ref("depowith");
    const showModal = ref(false);
    const transactionType = ref("");
    const tempAmount = ref(0);

    const authStore = useAuthStore();
    const router = useRouter();
    const transactionStore = useTransactionStore(); // ใช้ Store สำหรับธุรกรรม

    // ฟังก์ชันตรวจสอบจำนวนเงิน
    const validateAmount = () => {
      if (amount.value < 0) amount.value = 0;
      if (amount.value > 100000) amount.value = 100000;
    };

    // function click navbar
    const handleClickOutside = (event) => {
      if (
        navbar.value &&
        navbar.value.classList.contains("show") &&
        !event.target.closest(".navbar")
      ) {
        const bsCollapse = new Collapse(navbar.value);
        bsCollapse.hide();
      }
    };

    // Lifecycle hook
    onMounted(() => {
      navbar.value = document.getElementById("navbarNav");
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    // ฟังก์ชันเปิด modal เพื่อยืนยันการฝาก/ถอน
    const openConfirmModal = (type) => {
      if (amount.value > 0 && amount.value <= 100000) {
        transactionType.value = type;
        tempAmount.value = amount.value;
        showModal.value = true;
      } else {
        alert("กรุณากรอกจำนวนเงินที่ถูกต้อง");
      }
    };

    const confirmDepoWith = () => {
      if (transactionType.value === "ฝาก") {
        transactionStore.deposit(tempAmount.value); // เรียกฟังก์ชันฝากใน Store
        showModal.value = false;
      } else if (transactionType.value === "ถอน") {
        if (tempAmount.value <= transactionStore.balance) {
          transactionStore.withdraw(tempAmount.value); // เรียกฟังก์ชันถอนใน Store
          showModal.value = false;
        } else {
        alert("จำนวนเงินถอนเกินกว่ายอดคงเหลือ");
        return;
      }
      } else {
        alert("จำนวนเงินไม่ถูกต้อง หรือเกินยอดคงเหลือ");
        return;
      }
    };



    const showDepoWith = () => {
      currentView.value = "depowith";
    };

    const showTran = () => {
      currentView.value = "transaction";
    };

    const logout = () => {
      authStore.logout();
      router.push("/");
    };

    return {
      balance,
      amount,
      openConfirmModal,
      confirmDepoWith,
      showModal,
      transactionType,
      tempAmount,
      currentView,
      showDepoWith,
      showTran,
      validateAmount,
      logout,
      transactionStore
    };
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  /* ลดความทึบ */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 10px;
  /* ลด padding */
  border-radius: 8px;
  text-align: start;
  /* วางทางซ้าย */
  max-width: 500px;
  /* จำกัดความกว้าง */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.button-set {
  display: flex;
  justify-content: start;
  /* จัดให้อยู่ตรงซ้าย */
  gap: 10px;
  /* เพิ่มระยะห่างระหว่างปุ่ม */
  margin-top: 10px;
  /* เพิ่มระยะห่างจากข้อความด้านบน */

}
</style>