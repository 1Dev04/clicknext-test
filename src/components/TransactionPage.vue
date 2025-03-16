<script>
export default {
    data() {
        return {
            transctions: [
            { datetime: '06/06/2022 10:19:53', amount: 20000, status: 'ฝาก', email: 'email@gmail.com' },
            { datetime: '15/02/2022 21:24:24', amount: 40000, status: 'ถอน', email: 'email@gmail.com' },
            { datetime: '31/12/2021 23:59:49', amount: 100000, status: 'ถอน', email: 'email@gmail.com' }
            ]
        };
    },
    methods: {
        editTransaction(index) {
            alert(`แก้ไขรายการที่ ${index + 1}`);
        },
        deleteTransaction(index) {
            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')){
                this.transctions.splice(index, 1);
            }
        }
    }
};
</script>

<template>

    <!-- จัดการ layout กำหนดภายในเป็นแนวตั้ง จัดให้อยู่กึ่งกลาง สูงเต็มจอ -->
    <div class="container d-flex flex-column justify-content-center align-items-center mt-5 col-sm-5 col-md-5 col-lg-10">
        <h4 class="w-10 ">ประวัติรายการฝากถอน</h4>
        <table class="table table-bordered text-center w-100  ">
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
                <tr v-for="(transction, index) in transctions" :key="index">
                   
                        <td>{{ transction.datetime }}</td>
                        <td>{{ transction.amount.toLocaleString() }}</td>
                        <td :class="transction.status === 'ฝาก' ? 'text-success' : 'text-danger'">
                            {{ transction.status }}
                        </td>
                        <td>{{ transction.email }}</td>
                        <td>
                            <button v-if="transction.status === 'ฝาก'" class="btn btn-dark btn-sm me-1" @click="editTransaction(index)">
                                Edit
                            </button>
                            <button class="btn btn-danger btn-sm " @click="deleteTransaction(index)">
                                Delete
                            </button>
                        </td>
                        
                    
                </tr>
            </tbody>
        </table>
        <p>แสดง {{ transctions.length }} รายการ</p>
    </div>
  </template>

<style>
.table th, .table td {
  vertical-align: middle;
}
</style>

