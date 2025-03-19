
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTransactionStore = defineStore('transaction', () => {
   // เก็บรายการธุรกรรม
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

    

    const initBalance = 1000000;
    
    // ค่าเริ่มต้นของยอดเงินคงเหลือ
    const balance = computed(() => {
        return transactions.value.reduce((total, txn) => {
            return txn.status === "ฝาก" ? total + txn.amount : total - txn.amount;
    }, initBalance);
    });

    const deposit = (amount) => {
        transactions.value.push({
            datetime: new Date().toLocaleString("th-TH"), // กำหนดเวลาปัจจุบัน
            amount, 
            status: "ฝาก", 
            email: "email@gmail.com"
        });
    };

    const withdraw = (amount) => {
        transactions.value.push({
            datetime: new Date().toLocaleString("th-TH"), // กำหนดเวลาปัจจุบัน
            amount, 
            status: "ถอน", 
            email: "email@gmail.com"
        });
      };

    // ฟังก์ชันแก้ไขจำนวนเงินของธุรกรรม
    const updateTransactionAmount = (index, newAmount) => {
        if (newAmount >= 0 && newAmount <= 100000) {
            transactions.value[index].amount = newAmount;
        }
    };

    const removeTransaction = (index) => {
        transactions.value.splice(index, 1);
    };

    return {
        balance,
        deposit,
        withdraw,
        transactions,
        updateTransactionAmount,
        removeTransaction
    }
});