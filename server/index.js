const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (프로덕션용)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 데이터 로드
let pagesData;
let apisData;

try {
  pagesData = require('./data/pages.json');
  apisData = require('./data/apis.json');
  console.log('✅ 데이터 파일 로드 성공');
} catch (error) {
  console.error('❌ 데이터 파일 로드 실패:', error.message);
  process.exit(1);
}

// ============================================
// API 라우트
// ============================================

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 페이지 구조 데이터 조회
app.get('/api/pages', (req, res) => {
  try {
    res.json({
      success: true,
      data: pagesData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '페이지 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 특정 페이지 데이터 조회 (site 또는 dashboard)
app.get('/api/pages/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    if (!pagesData[type]) {
      return res.status(404).json({
        success: false,
        error: `'${type}' 페이지 타입을 찾을 수 없습니다.`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: pagesData[type],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '페이지 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// API 정보 데이터 조회
app.get('/api/apis', (req, res) => {
  try {
    res.json({
      success: true,
      data: apisData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'API 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 특정 카테고리 API 정보 조회
app.get('/api/apis/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    if (!apisData[category]) {
      return res.status(404).json({
        success: false,
        error: `'${category}' 카테고리를 찾을 수 없습니다.`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: apisData[category],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'API 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 특정 API 상세 정보 조회
app.get('/api/apis/:category/:apiId', (req, res) => {
  try {
    const { category, apiId } = req.params;
    
    if (!apisData[category]) {
      return res.status(404).json({
        success: false,
        error: `'${category}' 카테고리를 찾을 수 없습니다.`,
        timestamp: new Date().toISOString()
      });
    }

    const api = apisData[category].apis.find(a => a.id === apiId);
    
    if (!api) {
      return res.status(404).json({
        success: false,
        error: `'${apiId}' API를 찾을 수 없습니다.`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: api,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'API 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 통계 정보 (포트폴리오 메타 데이터)
app.get('/api/stats', (req, res) => {
  try {
    // 페이지 수 계산
    const countPages = (node) => {
      let count = 1;
      if (node.children) {
        node.children.forEach(child => {
          count += countPages(child);
        });
      }
      return count;
    };

    const sitePageCount = countPages(pagesData.site);
    const dashboardPageCount = countPages(pagesData.dashboard);

    // API 수 계산
    const apiCount = Object.values(apisData).reduce((total, category) => {
      return total + (category.apis ? category.apis.length : 0);
    }, 0);

    res.json({
      success: true,
      data: {
        pages: {
          site: sitePageCount,
          dashboard: dashboardPageCount,
          total: sitePageCount + dashboardPageCount
        },
        apis: {
          categories: Object.keys(apisData).length,
          total: apiCount
        },
        database: {
          tables: 20,
          description: 'MariaDB 기반'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '통계 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 404 에러 핸들러 (모든 라우트 마지막에 위치)
app.use((req, res, next) => {
  // API 요청인 경우
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: '요청하신 API를 찾을 수 없습니다.',
      path: req.path,
      timestamp: new Date().toISOString()
    });
  }
  
  // 개발 모드에서는 404 메시지 반환
  if (process.env.NODE_ENV !== 'production') {
    return res.status(404).json({
      success: false,
      error: '페이지를 찾을 수 없습니다.',
      path: req.path,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
});

// 전역 에러 핸들러
app.use((error, req, res, next) => {
  console.error('서버 에러:', error);
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('🚀 모두하나대축제 포트폴리오 서버 시작');
  console.log('='.repeat(50));
  console.log(`📍 서버 주소: http://localhost:${PORT}`);
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 페이지 데이터: ${Object.keys(pagesData).length}개 타입`);
  console.log(`🔌 API 데이터: ${Object.keys(apisData).length}개 카테고리`);
  console.log('='.repeat(50));
  console.log('');
  console.log('📌 사용 가능한 엔드포인트:');
  console.log(`   GET  /api/health              - 헬스 체크`);
  console.log(`   GET  /api/pages               - 전체 페이지 구조`);
  console.log(`   GET  /api/pages/:type         - 특정 타입 페이지`);
  console.log(`   GET  /api/apis                - 전체 API 정보`);
  console.log(`   GET  /api/apis/:category      - 카테고리별 API`);
  console.log(`   GET  /api/apis/:category/:id  - 특정 API 상세`);
  console.log(`   GET  /api/stats               - 통계 정보`);
  console.log('='.repeat(50));
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n서버를 종료합니다...');
  process.exit(0);
});