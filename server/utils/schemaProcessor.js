const fs = require('fs');
const path = require('path');

// schema_detail.json을 읽어서 tables.json 형식으로 변환
function processSchemaDetail() {
  const schemaPath = path.join(__dirname, '../data/schema_detail.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  const tablesData = {};
  
  // 테이블명으로 카테고리 분류
  function categorizeTable(tableName) {
    if (['users', 'user_consents', 'social_accounts', 'registrations'].includes(tableName)) {
      return 'core';
    }
    if (tableName.includes('event') || tableName.includes('prize') || tableName.includes('quiz')) {
      return 'event';
    }
    if (tableName.includes('news') || tableName.includes('writing') || tableName.includes('support')) {
      return 'content';
    }
    if (tableName.includes('analytics') || tableName.includes('daily_page') || tableName.includes('page_analytics')) {
      return 'analytics';
    }
    if (tableName.includes('verification') || tableName.includes('blacklist') || tableName.includes('deletion') || tableName.includes('limit')) {
      return 'security';
    }
    return 'admin';
  }
  
  // 테이블명으로 설명 생성
  function getTableDescription(tableName) {
    const descriptions = {
      users: '사용자 기본 정보',
      user_consents: '사용자 동의 정보',
      social_accounts: '소셜 계정 연동',
      registrations: '행사 신청 정보',
      event_participations: '이벤트 참여 기록',
      event_winners: '이벤트 당첨자',
      event_settings: '이벤트 설정',
      prizes: '경품 정보',
      prize_probabilities: '경품 확률',
      quiz_event_participants: '퀴즈 이벤트 참여자',
      news_items: '뉴스 및 공지사항',
      news_attachments: '뉴스 첨부파일',
      news_editor_images: '뉴스 에디터 이미지',
      writings: '사용자 작성 글',
      writing_likes: '글 좋아요',
      writing_topics: '글쓰기 주제',
      support_comments: '응원 메시지',
      support_comment_likes: '응원 메시지 좋아요',
      page_analytics: '페이지 방문 분석',
      daily_page_stats: '일별 페이지 통계',
      phone_verifications: '전화번호 인증',
      email_verifications: '이메일 인증',
      verification_limits: '인증 횟수 제한',
      email_verification_limits: '이메일 인증 제한',
      user_blacklist: '사용자 블랙리스트',
      account_deletions: '계정 삭제 기록',
      signup_deletion_patterns: '가입/탈퇴 패턴 분석',
      admin_actions: '관리자 활동 로그',
      allowed_email_domains: '허용 이메일 도메인',
      weather_banner_settings: '날씨 배너 설정'
    };
    return descriptions[tableName] || tableName.replace(/_/g, ' ');
  }
  
  // 외래키 관계 추론
  function inferRelationships(tableName, columns) {
    const relationships = [];
    
    columns.forEach(col => {
      const colName = col.name;
      
      // user_id가 있으면 users 테이블 참조
      if (colName === 'user_id' && tableName !== 'users') {
        relationships.push('users');
      }
      
      // admin_id가 있으면 users 테이블 참조 (관리자는 users의 role이 admin)
      if (colName === 'admin_id') {
        relationships.push('users');
      }
      
      // news_id가 있으면 news_items 참조
      if (colName === 'news_id' && tableName !== 'news_items') {
        relationships.push('news_items');
      }
      
      // prize_id가 있으면 prizes 참조
      if (colName === 'prize_id' && tableName !== 'prizes') {
        relationships.push('prizes');
      }
      
      // participation_id가 있으면 event_participations 참조
      if (colName === 'participation_id') {
        relationships.push('event_participations');
      }
      
      // writing_id가 있으면 writings 참조
      if (colName === 'writing_id' && tableName !== 'writings') {
        relationships.push('writings');
      }
      
      // comment_id가 있으면 support_comments 참조
      if (colName === 'comment_id' && tableName !== 'support_comments') {
        relationships.push('support_comments');
      }
    });
    
    // 중복 제거
    return [...new Set(relationships)];
  }
  
  // 각 테이블 처리
  Object.entries(schema).forEach(([tableName, tableSchema]) => {
    const columns = tableSchema.columns.map(col => ({
      name: col.name,
      type: col.type,
      nullable: col.nullable,
      comment: col.comment || null,
      default: col.default || null
    }));
    
    const primaryKeys = columns.filter(col => col.name === 'id').map(col => col.name);
    const relationships = inferRelationships(tableName, columns);
    
    tablesData[tableName] = {
      description: getTableDescription(tableName),
      category: categorizeTable(tableName),
      columns: columns,
      primaryKeys: primaryKeys.length > 0 ? primaryKeys : ['id'],
      relationships: relationships,
      columnCount: tableSchema.column_count
    };
  });
  
  // tables.json 생성
  const outputPath = path.join(__dirname, '../data/tables.json');
  fs.writeFileSync(outputPath, JSON.stringify(tablesData, null, 2));
  
  console.log(`✅ tables.json 생성 완료: ${Object.keys(tablesData).length}개 테이블`);
  return tablesData;
}

// 스크립트 직접 실행 시
if (require.main === module) {
  processSchemaDetail();
}

module.exports = { processSchemaDetail };