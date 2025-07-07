"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, UserPlus, Download } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"
import type { UserData } from "@/types/admin"

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // 더미 데이터
  useEffect(() => {
    const dummyUsers: UserData[] = [
      {
        id: "1",
        name: "김철수",
        email: "kim@example.com",
        phone: "010-1234-5678",
        joinDate: "2024-01-15",
        status: "active",
        totalPurchases: 5,
        totalSales: 12,
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
        rating: 4.8,
      },
      {
        id: "2",
        name: "이영희",
        email: "lee@example.com",
        phone: "010-2345-6789",
        joinDate: "2024-02-20",
        status: "active",
        totalPurchases: 8,
        totalSales: 3,
        verified: false,
        rating: 4.2,
      },
      {
        id: "3",
        name: "박민수",
        email: "park@example.com",
        phone: "010-3456-7890",
        joinDate: "2024-03-10",
        status: "suspended",
        totalPurchases: 2,
        totalSales: 0,
        verified: true,
        rating: 3.5,
      },
    ]

    setUsers(dummyUsers)
    setFilteredUsers(dummyUsers)
    setLoading(false)
  }, [])

  // 검색 및 필터링
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, statusFilter])

  const getStatusBadge = (status: UserData["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">활성</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">정지</Badge>
      case "banned":
        return <Badge className="bg-red-100 text-red-800">차단</Badge>
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">사용자 관리</h1>
          <p className="text-gray-600">전체 사용자를 관리하고 모니터링합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            사용자 추가
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 사용자</p>
                <p className="text-2xl font-bold">{users.length.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">인증된 사용자</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.verified).length}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">🔒</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">정지된 사용자</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "suspended").length}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">⚠️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="이름, 이메일, 전화번호로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="suspended">정지</SelectItem>
                <SelectItem value="banned">차단</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 목록 ({filteredUsers.length}명)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>거래 내역</TableHead>
                <TableHead>평점</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.verified && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            인증됨
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <p className="text-sm">{user.phone}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatRelativeTime(user.joinDate)}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>구매: {user.totalPurchases}회</p>
                      <p>판매: {user.totalSales}회</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm">{user.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
