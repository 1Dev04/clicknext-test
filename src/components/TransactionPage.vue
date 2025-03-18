<script>
import { computed, ref } from "vue";
import { useTransactionStore } from "@/stores/useTransactionStore";

export default {
    setup() {
        const showEditModal = ref(false);
        const showDeleteModal = ref(false);
        const selectedTransaction = ref(null);
        const editAmount = ref(0);
        const currentPage = ref(1);

        // use store 
        const transactionStore = useTransactionStore();


        // จำนวนที่แสดงต่อหน้า
        const perPage = ref(transactionStore.transactions.length);
        const startIndex = computed(() => (currentPage.value - 1) * perPage.value + 1);
        const endIndex = computed(() => Math.min(currentPage.value * perPage.value, transactionStore.transactions.length));

        // การตรวจสอบและปรับค่าจำนวนเงิน
        const validateAmount = () => {
            if (editAmount.value < 0) editAmount.value = 0;
            if (editAmount.value > 100000) editAmount.value = 100000;
            if (editAmount.value === "") alert("กรุณากรอกจำนวนเงินที่ถูกต้อง");
        };

        // ฟังก์ชันบันทึกการแก้ไขข้อมูล
        const saveEdit = () => {
            if (selectedTransaction.value !== null) {
                transactionStore.updateTransactionAmount(selectedTransaction.value, parseFloat(editAmount.value));
            }
            showEditModal.value = false;
        };

        // ฟังก์ชันแก้ไขรายการ
        const editTransaction = (index) => {
            if (transactionStore.transactions[index]) {
                selectedTransaction.value = index;
                editAmount.value = transactionStore.transactions[index].amount;
                showEditModal.value = true;
            } else {
                alert("Transaction ไม่พบข้อมูล");
            }

        };

        // ฟังก์ชันลบรายการ
        const confirmDelete = () => {
            if (selectedTransaction.value !== null) {
                transactionStore.removeTransaction(selectedTransaction.value);
            }
            showDeleteModal.value = false;
        };

        // ฟังก์ชันบันทึกการแก้ไขรายการ
        const saveEditTransaction = () => {
            if (selectedTransaction.value !== null) {
                transactionStore.updateTransactionAmount(selectedTransaction.value, parseFloat(editAmount.value));
            }
            showEditModal.value = false;
        };

        // ฟังก์ชันยืนยันการลบ
        const deleteTransaction = (index) => {
            selectedTransaction.value = index;
            showDeleteModal.value = true;
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
            transactionStore,
            validateAmount,
            perPage,
            currentPage,
            startIndex,
            endIndex,
            saveEdit,
        };
    },
};
</script>


<template>
    <!-- จัดการ layout กำหนดภายในเป็นแนวตั้ง จัดให้อยู่กึ่งกลาง สูงเต็มจอ -->
    <div
        class="container d-flex flex-column justify-content-center align-items-center mt-5 px-5 col-sm-10 col-md-10 col-lg-10">
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
                <tr v-for="(transaction, index) in transactionStore.transactions" :key="index">
                    <td>{{ transaction.datetime }}</td>
                    <td>{{ transaction.amount.toLocaleString() }}</td>
                    <td :class="transaction.status === 'ฝาก' ? 'text-success' : 'text-danger'
                        ">
                        {{ transaction.status }}
                    </td>
                    <td>{{ transaction.email }}</td>
                    <td>
                        <button v-if="transaction.status === 'ฝาก'" class="btn btn-dark btn-sm me-1"
                            @click="editTransaction(index)">
                            Edit
                        </button>
                        <button v-if="transaction.status === 'ถอน'" class="btn btn-dark btn-sm"
                            @click="deleteTransaction(index)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>แสดง {{ startIndex }} ถึง {{ endIndex }} จาก {{ transactionStore.transactions.length }} รายการ</p>

        <!-- Modal Edit -->
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <h4>แก้ไขจำนวนเงินฝาก</h4>
                <p v-if="selectedTransaction !== null && transactionStore.transactions?.[selectedTransaction]">
                    ของวันที่ {{ transactionStore.transactions[selectedTransaction].datetime }}
                </p>
                <p v-if="selectedTransaction !== null && transactionStore.transactions?.[selectedTransaction]">
                    จากอีเมล {{ transactionStore.transactions[selectedTransaction].email }}
                </p>
                <label>จำนวนเงิน *</label>
                <input v-model="editAmount" @input="validateAmount" class="form-control mb-4" type="number" min="0"
                    max="100000" />
                <div class="button-set">
                    <button @click="saveEdit" class="btn btn-dark">ยืนยัน</button>
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
                <p v-if="selectedTransaction !== null">
                    จำนวนเงินถอน {{ transactionStore.transactions[selectedTransaction].amount?.toLocaleString() }} บาท
                </p>
                <p v-if="selectedTransaction !== null">
                    ของวัยที่ {{ transactionStore.transactions[selectedTransaction].datetime }}
                </p>
                <p v-if="selectedTransaction !== null">
                    จากอีเมล {{ transactionStore.transactions[selectedTransaction].email }}
                </p>
                <div class="button-set">
                    <button @click="confirmDelete" class="btn btn-dark">ยืนยัน</button>
                    <button @click="showDeleteModal = false" class="btn btn-light">
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

.table-responsive {
  overflow-x: auto;
}

</style>
