const http = require('http');

const testEndpoints = [
  { method: 'GET', path: '/api/health', name: '헬스 체크' },
  { method: 'GET', path: '/api/pages', name: '전체 페이지' },
  { method: 'GET', path: '/api/pages/site', name: '사이트 페이지' },
  { method: 'GET', path: '/api/pages/dashboard', name: '대시보드 페이지' },
  { method: 'GET', path: '/api/apis', name: '전체 API' },
  { method: 'GET', path: '/api/apis/auth', name: '인증 API' },
  { method: 'GET', path: '/api/stats', name: '통계 정보' },
];

console.log('🧪 서버 API 테스트 시작...\n');

const runTest = (endpoint, index) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint.path,
      method: endpoint.method,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const status = res.statusCode === 200 ? '✅' : '❌';
        console.log(`${status} [${index + 1}/${testEndpoints.length}] ${endpoint.name}`);
        console.log(`   ${endpoint.method} ${endpoint.path} - Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   Response: ${json.success ? '성공' : '실패'}`);
          } catch (e) {
            console.log(`   Response: 파싱 실패`);
          }
        }
        console.log('');
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ [${index + 1}/${testEndpoints.length}] ${endpoint.name}`);
      console.log(`   에러: ${error.message}`);
      console.log('');
      resolve();
    });

    req.end();
  });
};

(async () => {
  for (let i = 0; i < testEndpoints.length; i++) {
    await runTest(testEndpoints[i], i);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.log('✅ 테스트 완료!');
})();