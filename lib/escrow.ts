import { db } from "./firebase"
import { collection, doc, updateDoc, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore"
import type { EscrowTransaction, PurchaseConfirmation } from "@/types/escrow"

export class EscrowService {
  // 에스크로 거래 생성
  static async createTransaction(transaction: Omit<EscrowTransaction, "id" | "createdAt" | "updatedAt">) {
    try {
      const autoConfirmDate = new Date()
      autoConfirmDate.setDate(autoConfirmDate.getDate() + 7) // 7일 후

      const docRef = await addDoc(collection(db, "escrow_transactions"), {
        ...transaction,
        autoConfirmDate: Timestamp.fromDate(autoConfirmDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      return { success: true, transactionId: docRef.id }
    } catch (error) {
      console.error("에스크로 거래 생성 실패:", error)
      return { success: false, error }
    }
  }

  // 배송 완료 처리
  static async markAsDelivered(transactionId: string, deliveryDate: Date) {
    try {
      const transactionRef = doc(db, "escrow_transactions", transactionId)
      await updateDoc(transactionRef, {
        status: "delivered",
        deliveryDate: Timestamp.fromDate(deliveryDate),
        updatedAt: Timestamp.now(),
      })

      return { success: true }
    } catch (error) {
      console.error("배송 완료 처리 실패:", error)
      return { success: false, error }
    }
  }

  // 구매 확정 (수동)
  static async confirmPurchase(confirmation: PurchaseConfirmation) {
    try {
      const transactionRef = doc(db, "escrow_transactions", confirmation.transactionId)
      await updateDoc(transactionRef, {
        status: "confirmed",
        confirmationDate: Timestamp.fromDate(confirmation.confirmationDate),
        updatedAt: Timestamp.now(),
      })

      // 구매 확정 기록 저장
      await addDoc(collection(db, "purchase_confirmations"), {
        ...confirmation,
        confirmationDate: Timestamp.fromDate(confirmation.confirmationDate),
      })

      // 판매자에게 정산 처리 (실제로는 PG사 API 호출)
      await this.releasePaymentToSeller(confirmation.transactionId)

      return { success: true }
    } catch (error) {
      console.error("구매 확정 실패:", error)
      return { success: false, error }
    }
  }

  // 자동 구매 확정 (7일 후)
  static async autoConfirmExpiredTransactions() {
    try {
      const now = new Date()
      const q = query(
        collection(db, "escrow_transactions"),
        where("status", "==", "delivered"),
        where("autoConfirmDate", "<=", Timestamp.fromDate(now)),
      )

      const querySnapshot = await getDocs(q)
      const autoConfirmPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const transactionId = docSnapshot.id
        const data = docSnapshot.data()

        await this.confirmPurchase({
          transactionId,
          buyerId: data.buyerId,
          confirmationType: "auto",
          confirmationDate: now,
        })
      })

      await Promise.all(autoConfirmPromises)
      return { success: true, confirmedCount: querySnapshot.docs.length }
    } catch (error) {
      console.error("자동 구매 확정 실패:", error)
      return { success: false, error }
    }
  }

  // 판매자에게 정산 처리
  private static async releasePaymentToSeller(transactionId: string) {
    // 실제로는 PG사 API를 통해 판매자 계좌로 송금
    console.log(`판매자에게 정산 처리: ${transactionId}`)

    // Mock 구현
    return { success: true }
  }

  // 분쟁 신청
  static async createDispute(transactionId: string, reason: string, evidence: string[]) {
    try {
      const transactionRef = doc(db, "escrow_transactions", transactionId)
      await updateDoc(transactionRef, {
        status: "disputed",
        disputeReason: reason,
        updatedAt: Timestamp.now(),
      })

      // 분쟁 상세 정보 저장
      await addDoc(collection(db, "disputes"), {
        transactionId,
        reason,
        evidence,
        status: "pending",
        createdAt: Timestamp.now(),
      })

      return { success: true }
    } catch (error) {
      console.error("분쟁 신청 실패:", error)
      return { success: false, error }
    }
  }
}
