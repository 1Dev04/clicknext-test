<template>
  <nav class="navbar navbar-expand-lg px-4 border border-black bg-transparent">
    <div class="container-fluid">
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <h3 class="navbar px-4">Clicknext</h3>
      <button @click="logout" class="btn btn-dark">Logout</button>
    </div>
  </nav>

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

  <div class="content" v-if="currentView === 'depowith'">
    <div
      class="container d-flex flex-column justify-content-center align-items-center mt-5 col-sm-10 col-md-10 col-lg-10 p-5">
      <div class="w-10 ">
        <h4 class="mt-5 text-center">
          จำนวนเงินคงเหลือ {{ balance.toLocaleString() }} บาท
        </h4>
        <h6 class="mt-5 align-self-start">จำนวนเงิน *</h6>
        <input v-model.number="amount" class="form-control mb-4" type="number" min="0" max="100000"
          placeholder="กรอกจำนวนเงิน" />
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
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { Collapse } from "bootstrap";
import TransactionPage from "./TransactionPage.vue";



export default {
  components: { TransactionPage },
  setup() {
    const navbar = ref(null);
    const amount = ref(0);
    const balance = ref(0);
    const currentView = ref("depowith");
    const showModal = ref(false);
    const transactionType = ref("");
    const tempAmount = ref(0);
    
    const authStore = useAuthStore();
    const router = useRouter();

    watch(amount, (newValue, oldValue) => {
      if (isNaN(newValue) || newValue < 0 || newValue > 100000) {
        amount.value = oldValue;
      }
    });

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

    onMounted(() => {
      navbar.value = document.getElementById("navbarNav");
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

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
        balance.value += tempAmount.value;
      } else if (transactionType.value === "ถอน" && tempAmount.value <= balance.value) {
        balance.value -= tempAmount.value;
      } else {
        alert("จำนวนเงินไม่ถูกต้อง หรือเกินยอดคงเหลือ");
      }
      amount.value = 0;
      showModal.value = false;
    };

    const showDepoWith = () => {
      currentView.value = "depowith";
    };

    const showTran = () => {
      currentView.value = "transaction";
    };


    const logout = () => {
      authStore.logout();
      router.push('/');
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
      logout
    };
  },
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