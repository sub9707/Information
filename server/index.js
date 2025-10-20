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
let tablesData;

try {
  pagesData = require('./data/pages.json');
  apisData = require('./data/apis.json');
  tablesData = require('./data/tables.json');
  console.log('✅ 데이터 파일 로드 성공');
  console.log(`   - 페이지: ${Object.keys(pagesData).length}개`);
  console.log(`   - API 카테고리: ${Object.keys(apisData).length}개`);
  console.log(`   - 테이블: ${Object.keys(tablesData).length}개`);
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

// SQL 테이블 정보 조회
app.get('/api/tables', (req, res) => {
  try {
    res.json({
      success: true,
      data: tablesData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'SQL 테이블 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 특정 테이블 정보 조회
app.get('/api/tables/:tableName', (req, res) => {
  try {
    const { tableName } = req.params;
    
    if (!tablesData[tableName]) {
      return res.status(404).json({
        success: false,
        error: `'${tableName}' 테이블을 찾을 수 없습니다.`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: tablesData[tableName],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'SQL 테이블 데이터를 불러오는데 실패했습니다.',
      timestamp: new Date().toISOString()
    });
  }
});

// 카테고리별 테이블 조회
app.get('/api/tables/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    const filteredTables = Object.entries(tablesData)
      .filter(([_, table]) => table.category === category)
      .reduce((acc, [name, table]) => {
        acc[name] = table;
        return acc;
      }, {});

    if (Object.keys(filteredTables).length === 0) {
      return res.status(404).json({
        success: false,
        error: `'${category}' 카테고리의 테이블을 찾을 수 없습니다.`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: filteredTables,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'SQL 테이블 데이터를 불러오는데 실패했습니다.',
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

    // 테이블 수 계산
    const tableCount = Object.keys(tablesData).length;

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
          tables: tableCount,
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
      timestamp: new Date().toISOString()
    });
  }

  // 프로덕션에서는 React 앱의 index.html 제공
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('');
  console.log('================================================');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================================');
  console.log('');
});