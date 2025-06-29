-- 테스트 사용자 데이터
INSERT INTO users (id, phone, name, nickname, email, rating, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', '010-1234-5678', '김철수', '경매왕', 'kim@test.com', 4.8, true),
('550e8400-e29b-41d4-a716-446655440002', '010-2345-6789', '이영희', '수집가', 'lee@test.com', 4.9, true),
('550e8400-e29b-41d4-a716-446655440003', '010-3456-7890', '박민수', '판매고수', 'park@test.com', 4.7, true),
('550e8400-e29b-41d4-a716-446655440004', '010-4567-8901', '최지은', '입찰러', 'choi@test.com', 4.6, true),
('550e8400-e29b-41d4-a716-446655440005', '010-5678-9012', '정태현', '컬렉터', 'jung@test.com', 4.9, true);

-- 테스트 카테고리 데이터
INSERT INTO categories (id, name, description, icon) VALUES
('cat-electronics', '전자제품', '스마트폰, 노트북, 가전제품', 'smartphone'),
('cat-fashion', '패션/의류', '옷, 신발, 가방, 액세서리', 'shirt'),
('cat-books', '도서/음반', '책, CD, DVD, 게임', 'book'),
('cat-sports', '스포츠/레저', '운동용품, 아웃도어 용품', 'dumbbell'),
('cat-home', '생활/가구', '가구, 인테리어, 생활용품', 'home'),
('cat-beauty', '뷰티/미용', '화장품, 향수, 미용기기', 'sparkles'),
('cat-toys', '완구/취미', '장난감, 피규어, 수집품', 'gamepad2'),
('cat-art', '예술/골동품', '그림, 조각, 골동품', 'palette');

-- 테스트 경매 데이터
INSERT INTO auctions (
  id, seller_id, category_id, title, description, condition, 
  starting_price, current_price, buy_now_price, reserve_price,
  images, location, shipping_cost, status, start_time, end_time
) VALUES
(
  'auction-001',
  '550e8400-e29b-41d4-a716-446655440001',
  'cat-electronics',
  '아이폰 14 Pro 256GB 딥퍼플 (미개봉)',
  '애플스토어에서 구매한 정품 미개봉 제품입니다. 선물받았는데 이미 폰이 있어서 판매합니다.',
  'new',
  800000,
  850000,
  1200000,
  900000,
  ARRAY['/images/iphone14pro-1.jpg', '/images/iphone14pro-2.jpg'],
  '서울 강남구',
  3000,
  'active',
  NOW() - INTERVAL '2 hours',
  NOW() + INTERVAL '22 hours'
),
(
  'auction-002',
  '550e8400-e29b-41d4-a716-446655440002',
  'cat-fashion',
  '구찌 마몬트 숄더백 (정품)',
  '작년에 백화점에서 구매한 구찌 마몬트 백입니다. 몇 번 사용했지만 상태 양호합니다.',
  'like_new',
  500000,
  520000,
  800000,
  600000,
  ARRAY['/images/gucci-bag-1.jpg', '/images/gucci-bag-2.jpg'],
  '서울 강서구',
  5000,
  'active',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '23 hours'
),
(
  'auction-003',
  '550e8400-e29b-41d4-a716-446655440003',
  'cat-art',
  '김환기 화집 한정판 (1/100)',
  '김환기 화집 한정판입니다. 100부 중 1번째 에디션으로 매우 희귀합니다.',
  'good',
  200000,
  250000,
  400000,
  300000,
  ARRAY['/images/art-book-1.jpg'],
  '서울 종로구',
  8000,
  'active',
  NOW() - INTERVAL '30 minutes',
  NOW() + INTERVAL '23.5 hours'
);

-- 테스트 입찰 데이터
INSERT INTO bids (auction_id, bidder_id, amount, is_auto_bid, max_bid_amount) VALUES
('auction-001', '550e8400-e29b-41d4-a716-446655440004', 820000, false, NULL),
('auction-001', '550e8400-e29b-41d4-a716-446655440005', 850000, true, 950000),
('auction-002', '550e8400-e29b-41d4-a716-446655440001', 520000, false, NULL),
('auction-003', '550e8400-e29b-41d4-a716-446655440002', 230000, false, NULL),
('auction-003', '550e8400-e29b-41d4-a716-446655440004', 250000, true, 350000);

-- 최고 입찰자 업데이트
UPDATE auctions SET 
  current_price = 850000,
  total_bids = 2
WHERE id = 'auction-001';

UPDATE auctions SET 
  current_price = 520000,
  total_bids = 1
WHERE id = 'auction-002';

UPDATE auctions SET 
  current_price = 250000,
  total_bids = 2
WHERE id = 'auction-003';
