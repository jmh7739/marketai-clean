"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Key, Shield, Clock } from "lucide-react"

export default function AccessControlPage() {
  const [accessLogs, setAccessLogs] = useState([])
  const [newPassword, setNewPassword] = useState("")

  const generateNewPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewPassword(password)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          접근 제어 관리
        </h1>
        <p className="text-gray-600 mt-2">베타 테스트 접근 권한을 관리합니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 현재 비밀번호 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              현재 접근 비밀번호
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
              <p>• marketai2024!</p>
              <p>• admin123!@#</p>
              <p>• test2024</p>
              <p>• beta-access</p>
            </div>
            <div>
              <Label htmlFor="newPassword">새 비밀번호 생성</Label>
              <div className="flex space-x-2">
                <Input
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호"
                />
                <Button onClick={generateNewPassword}>생성</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 접근 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              접근 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>오늘 접근 시도</span>
                <span className="font-semibold">12회</span>
              </div>
              <div className="flex justify-between">
                <span>성공한 접근</span>
                <span className="font-semibold text-green-600">8회</span>
              </div>
              <div className="flex justify-between">
                <span>실패한 접근</span>
                <span className="font-semibold text-red-600">4회</span>
              </div>
              <div className="flex justify-between">
                <span>현재 활성 세션</span>
                <span className="font-semibold">3개</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 접근 로그 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            최근 접근 로그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm">성공적인 접근</span>
              <span className="text-xs text-gray-500">2024-01-15 14:30:25</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="text-sm">잘못된 비밀번호</span>
              <span className="text-xs text-gray-500">2024-01-15 14:25:10</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm">성공적인 접근</span>
              <span className="text-xs text-gray-500">2024-01-15 13:45:33</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
