-- MarketAI 초기 데이터
INSERT INTO categories (id, name, description) VALUES
  ('cat1', '전자제품', '스마트폰, 노트북, 가전제품 등'),
  ('cat2', '패션', '의류, 신발, 액세서리 등'),
  ('cat3', '홈&리빙', '가구, 인테리어, 생활용품 등'),
  ('cat4', '스포츠', '운동용품, 아웃도어 장비 등');

INSERT INTO users (id, email, name) VALUES
  ('user1', 'test1@example.com', '테스트유저1'),
  ('user2', 'test2@example.com', '테스트유저2');
