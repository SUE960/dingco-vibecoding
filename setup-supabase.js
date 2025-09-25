#!/usr/bin/env node

// Supabase 데이터베이스 자동 설정 스크립트
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://txddvsvhthurtuphmhzw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4ZGR2c3ZodGh1cnR1cG1obXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDU2NjYsImV4cCI6MjA3Mzg4MTY2Nn0.0mHQfpXDPaFEMwniW2K52eoO_jAM6GplOvosA3XOKWY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🚀 Supabase 데이터베이스 설정을 시작합니다...\n');

// 마이그레이션 파일 경로
const migrationsDir = path.join(__dirname, 'migrations');
const migrationFiles = [
  '001_create_tables.sql',
  '002_create_triggers.sql',
  '003_insert_initial_data.sql',
  '004_setup_rls.sql'
];

async function executeSql(sql, description) {
  console.log(`📝 ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`❌ 오류: ${error.message}`);
      return false;
    }
    
    console.log(`✅ ${description} 완료`);
    return true;
  } catch (error) {
    console.error(`❌ 예외: ${error.message}`);
    return false;
  }
}

async function runMigrations() {
  let successCount = 0;
  
  for (const fileName of migrationFiles) {
    const filePath = path.join(migrationsDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  파일이 없습니다: ${fileName}`);
      continue;
    }
    
    const sql = fs.readFileSync(filePath, 'utf8');
    const description = fileName.replace(/^\d+_/, '').replace('.sql', '').replace(/_/g, ' ');
    
    const success = await executeSql(sql, description);
    if (success) {
      successCount++;
    }
    
    console.log(''); // 빈 줄 추가
  }
  
  console.log(`🎉 마이그레이션 완료: ${successCount}/${migrationFiles.length} 성공`);
  
  // 테스트 쿼리 실행
  console.log('\n🔍 설정 확인 중...');
  await testSetup();
}

async function testSetup() {
  try {
    // 테이블 목록 확인
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log('⚠️  테이블 목록 확인 실패:', tablesError.message);
    } else {
      console.log('📋 생성된 테이블들:');
      tables.forEach(table => console.log(`   - ${table.table_name}`));
    }
    
    // 기본 데이터 확인
    const { data: presets, error: presetsError } = await supabase
      .from('company_presets')
      .select('name')
      .limit(3);
    
    if (presetsError) {
      console.log('⚠️  데이터 확인 실패:', presetsError.message);
    } else {
      console.log('🏢 기본 회사 규격 데이터:');
      presets.forEach(preset => console.log(`   - ${preset.name}`));
    }
    
  } catch (error) {
    console.log('⚠️  확인 중 오류:', error.message);
  }
}

// 실행
runMigrations().catch(error => {
  console.error('💥 스크립트 실행 중 오류:', error);
  process.exit(1);
});
