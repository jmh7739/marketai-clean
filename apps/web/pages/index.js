import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MarketAI - 이베이 스타일 마켓플레이스</title>
        <meta name="description" content="이베이 스타일 온라인 마켓플레이스" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          🛒 MarketAI에 오신 것을 환영합니다!
        </h1>

        <p className={styles.description}>
          이베이 스타일 온라인 마켓플레이스
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>상품 판매 &rarr;</h2>
            <p>당신의 상품을 쉽게 판매하세요</p>
          </div>

          <div className={styles.card}>
            <h2>상품 구매 &rarr;</h2>
            <p>다양한 상품을 저렴하게 구매하세요</p>
          </div>

          <div className={styles.card}>
            <h2>경매 참여 &rarr;</h2>
            <p>실시간 경매에 참여하세요</p>
          </div>

          <div className={styles.card}>
            <h2>안전 거래 &rarr;</h2>
            <p>안전하고 신뢰할 수 있는 거래</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by MarketAI Team
        </p>
      </footer>
    </div>
  )
}