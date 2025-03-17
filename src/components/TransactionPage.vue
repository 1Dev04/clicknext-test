<script>
import { ref, watch } from "vue";

export default {
  setup() {
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedTransaction = ref(null);
    const editAmount = ref(0);
    const showModal = ref(false);
    
    const transactions = ref([
      {
        datetime: "06/06/2022 10:19:53",
        amount: 20000,
        status: "ฝาก",
        email: "email@gmail.com",
      },
      {
        datetime: "15/02/2022 21:24:24",
        amount: 40000,
        status: "ถอน",
        email: "email@gmail.com",
      },
      {
        datetime: "31/12/2021 23:59:49",
        amount: 100000,
        status: "ถอน",
        email: "email@gmail.com",
      },
    ]);

    

    watch(editAmount, (newValue, oldValue) => {
      if (isNaN(newValue) || newValue < 0 || newValue > 100000) {
        editAmount.value = oldValue;
      }
    });

    const editTransaction = (index) => {
      if (transactions.value && transactions.value[index]) {
        selectedTransaction.value = { ...transactions[index] };
        editAmount.value = selectedTransaction.value.editAmount;
        showEditModal.value = true;
      }
    };

    const saveEditTransaction = () => {
      if (selectedTransaction.value) {
        selectedTransaction.value.amount = editAmount.value;
        showEditModal.value = true;
      }
    };

    const deleteTransaction = (index) => {
      selectedTransaction.value = { ...transactions[index] };
      showDeleteModal.value = true;

    };

    const confirmDelete = (index) => {
      if (selectedTransaction.value) {
        transactions.value = transactions.value.filter(
          (t) => t !== selectedTransaction.value
        );
        selectedTransaction.value = null;
        showDeleteModal.value = false;
        transactions.value.splice(index, 1);
      }
    };

    return {
      editTransaction,
      saveEditTransaction,
      deleteTransaction,
      confirmDelete,
      showDeleteModal,
      showEditModal,
      selectedTransaction,
      editAmount,
      transactions,
      showModal
    };
  },
};
</script>

<template>
  <!-- จัดการ layout กำหนดภายในเป็นแนวตั้ง จัดให้อยู่กึ่งกลาง สูงเต็มจอ -->
  <div
    class="container d-flex flex-column justify-content-center align-items-center mt-5 col-sm-5 col-md-5 col-lg-10"
  >
    <h4 class="w-10">ประวัติรายการฝากถอน</h4>
    <table class="table table-bordered text-center w-100">
      <thead class="table-light">
        <tr>
          <th>Datetime</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.datetime }}</td>
          <td>{{ transaction.amount.toLocaleString() }}</td>
          <td
            :class="
              transaction.status === 'ฝาก' ? 'text-success' : 'text-danger'
            "
          >
            {{ transaction.status }}
          </td>
          <td>{{ transaction.email }}</td>
          <td>
            <button
              v-if="transaction.status === 'ฝาก'"
              class="btn btn-dark btn-sm me-1"
              @click="editTransaction(index)"
            >
              Edit
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteTransaction(index)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p>แสดง {{ transactions.length }} รายการ</p>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h4>แก้ไขจำนวนเงินฝาก</h4>
        <p v-if="selectedTransaction">
          ของวันที่ {{ selectedTransaction.datetime }}
        </p>
        <p v-if="selectedTransaction">
          จากอีเมล {{ selectedTransaction.email }}
        </p>
        <label>จำนวนเงิน *</label>
        <input v-model.number="editedAmount" class="form-control mb-4" type="number" min="0" max="100000"
          placeholder="" />
        <div class="button-set">
          <button @click="confirmDepoWith" class="btn btn-dark">ยืนยัน</button>
          <button @click="showEditModal = false" class="btn btn-light">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h4>ยืนยันการลบ</h4>
        <p v-if="selectedTransaction">
          จำนวนเงินถอน {{ selectedTransaction.amount?.toLocaleString() }} บาท
        </p>
        <p v-if="selectedTransaction">
          ของวัยที่ {{ selectedTransaction.datetime }}
        </p>
        <p v-if="selectedTransaction">
          จากอีเมล {{ selectedTransaction.email }}
        </p>
        <div class="button-set">
          <button @click="confirmDelete" class="btn btn-dark">ยืนยัน</button>
          <button @click="showDeleteModal = false " class="btn btn-light" >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.table th,
.table td {
  vertical-align: middle;
}

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

.form-control {
  width: 100;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
