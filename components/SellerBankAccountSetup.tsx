"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, CreditCard, Shield } from "lucide-react"

const BANKS = [
  { code: "004", name: "국민은행" },
  { code: "011", name: "농협은행" },
  { code: "020", name: "우리은행" },
  { code: "088", name: "신한은행" },
  { code: "081", name: "하나은행" },
  { code: "027", name: "씨티은행" },
  { code: "023", name: "SC제일은행" },
  { code: "039", name: "경남은행" },
  { code: "034", name: "광주은행" },
  { code: "032", name: "부산은행" },
  { code: "045", name: "새마을금고" },
  { code: "048", name: "신협" },
  { code: "071", name: "우체국" },
  { code: "089", name: "케이뱅크" },
  { code: "090", name: "카카오뱅크" },
  { code: "092", name: "토스뱅크" },
]

interface BankAccount {
  id?: string
  bankCode: string
  bankName: string
  accountNumber: string
  accountHolder: string
  isVerified: boolean
  isPrimary: boolean
}

export default function SellerBankAccountSetup() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newAccount, setNewAccount] = useState({
    bankCode: "",
    accountNumber: "",
    accountHolder: "",
  })
  const [verificationStep, setVerificationStep] = useState<"input" | "verify" | "complete">("input")
  const [verificationAmount, setVerificationAmount] = useState<number>(0)
  const [userInputAmount, setUserInputAmount] = useState("")

  // 계좌 추가 시작
  const startAddingAccount = () => {
    setIsAdding(true)
    setVerificationStep("input")
    setNewAccount({ bankCode: "", accountNumber: "", accountHolder: "" })
  }

  // 1원 인증 시작
  const startVerification = async () => {
    if (!newAccount.bankCode || !newAccount.accountNumber || !newAccount.accountHolder) {
      alert("모든 정보를 입력해주세요")
      return
    }

    // 실제로는 은행 API를 통해 1원 송금
    const randomAmount = Math.floor(Math.random() * 100) + 1
    setVerificationAmount(randomAmount)
    setVerificationStep("verify")

    // 모의 1원 송금 (실제로는 은행 API 호출)
    try {
      // await bankAPI.sendVerificationAmount({
      //   bankCode: newAccount.bankCode,
      //   accountNumber: newAccount.accountNumber,
      //   amount: randomAmount
      // })

      alert(`인증용 ${randomAmount}원이 입금되었습니다. 통장을 확인해주세요.`)
    } catch (error) {
      alert("계좌 인증에 실패했습니다. 계좌번호를 확인해주세요.")
    }
  }

  // 인증 완료
  const completeVerification = () => {
    if (Number.parseInt(userInputAmount) === verificationAmount) {
      const newBankAccount: BankAccount = {
        id: Date.now().toString(),
        bankCode: newAccount.bankCode,
        bankName: BANKS.find((b) => b.code === newAccount.bankCode)?.name || "",
        accountNumber: newAccount.accountNumber,
        accountHolder: newAccount.accountHolder,
        isVerified: true,
        isPrimary: accounts.length === 0, // 첫 번째 계좌는 자동으로 주계좌
      }

      setAccounts((prev) => [...prev, newBankAccount])
      setVerificationStep("complete")

      // 실제로는 서버에 저장
      // await saveUserBankAccount(newBankAccount)

      setTimeout(() => {
        setIsAdding(false)
        setVerificationStep("input")
      }, 2000)
    } else {
      alert("입금액이 일치하지 않습니다. 다시 확인해주세요.")
    }
  }

  // 주계좌 설정
  const setPrimaryAccount = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((account) => ({
        ...account,
        isPrimary: account.id === accountId,
      })),
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">정산 계좌 등록</h2>
        <p className="text-gray-600">판매 대금을 받을 계좌를 등록해주세요</p>
      </div>

      {/* 등록된 계좌 목록 */}
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              등록된 계좌
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{account.bankName}</span>
                        {account.isPrimary && <Badge variant="default">주계좌</Badge>}
                        {account.isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-sm text-gray-600">
                        {account.accountNumber} ({account.accountHolder})
                      </p>
                    </div>
                  </div>
                  {!account.isPrimary && (
                    <Button variant="outline" size="sm" onClick={() => setPrimaryAccount(account.id!)}>
                      주계좌 설정
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 계좌 추가 */}
      {!isAdding ? (
        <Button onClick={startAddingAccount} className="w-full">
          계좌 추가하기
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>계좌 추가</CardTitle>
          </CardHeader>
          <CardContent>
            {verificationStep === "input" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bank">은행 선택</Label>
                  <Select
                    value={newAccount.bankCode}
                    onValueChange={(value) => setNewAccount((prev) => ({ ...prev, bankCode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="은행을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANKS.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accountNumber">계좌번호</Label>
                  <Input
                    id="accountNumber"
                    value={newAccount.accountNumber}
                    onChange={(e) =>
                      setNewAccount((prev) => ({ ...prev, accountNumber: e.target.value.replace(/[^0-9]/g, "") }))
                    }
                    placeholder="계좌번호를 입력하세요 (숫자만)"
                    maxLength={20}
                  />
                </div>

                <div>
                  <Label htmlFor="accountHolder">예금주명</Label>
                  <Input
                    id="accountHolder"
                    value={newAccount.accountHolder}
                    onChange={(e) => setNewAccount((prev) => ({ ...prev, accountHolder: e.target.value }))}
                    placeholder="예금주명을 입력하세요"
                  />
                </div>

                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    계좌 인증을 위해 1-100원의 소액이 입금됩니다. 인증 후 자동으로 환불됩니다.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                    취소
                  </Button>
                  <Button onClick={startVerification} className="flex-1">
                    계좌 인증하기
                  </Button>
                </div>
              </div>
            )}

            {verificationStep === "verify" && (
              <div className="space-y-4 text-center">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">계좌 인증 중</h3>
                  <p className="text-gray-600 mb-4">
                    {newAccount.accountHolder}님의 {BANKS.find((b) => b.code === newAccount.bankCode)?.name} 계좌로
                    <br />
                    인증용 소액이 입금되었습니다.
                  </p>
                  <p className="text-sm text-gray-500">통장을 확인하고 입금된 정확한 금액을 입력해주세요.</p>
                </div>

                <div>
                  <Label htmlFor="verificationAmount">입금된 금액</Label>
                  <Input
                    id="verificationAmount"
                    type="number"
                    value={userInputAmount}
                    onChange={(e) => setUserInputAmount(e.target.value)}
                    placeholder="입금된 금액을 입력하세요"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setVerificationStep("input")} className="flex-1">
                    이전
                  </Button>
                  <Button onClick={completeVerification} className="flex-1">
                    인증 완료
                  </Button>
                </div>
              </div>
            )}

            {verificationStep === "complete" && (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">계좌 인증 완료!</h3>
                <p className="text-gray-600">계좌가 성공적으로 등록되었습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 && !isAdding && (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>상품을 판매하려면 정산받을 계좌를 먼저 등록해야 합니다.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
