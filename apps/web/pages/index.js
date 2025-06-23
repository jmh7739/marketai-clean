import Head from "next/head"
import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import CategoryNav from "../components/CategoryNav"
import FeaturedProducts from "../components/FeaturedProducts"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div>
      <Head>
        <title>MarketAI - 이베이 스타일 온라인 마켓플레이스</title>
        <meta name="description" content="안전하고 편리한 온라인 쇼핑몰" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <SearchBar />
      <CategoryNav />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">오늘의 특가</h2>
          <FeaturedProducts />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">인기 카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold">전자제품</h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold">패션</h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold">홈&가든</h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold">스포츠</h3>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
