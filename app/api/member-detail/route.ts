import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deptCd = searchParams.get('deptCd');
  const numKey = searchParams.get('numKey');

  if (!deptCd || !numKey) {
    return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://apis.data.go.kr/9710000/NationalAssemblyInfoService/getMemberDetailInfoList?serviceKey=${process.env.SERVICE_KEY}&numOfRows=10&pageNo=1&dept_cd=${deptCd}&num=${numKey}`
    );
    
    const xmlText = await response.text();
    return NextResponse.json({ xmlText });
  } catch (error) {
    console.error('Error fetching member detail:', error);
    return NextResponse.json({ error: '데이터를 가져오는데 실패했습니다.' }, { status: 500 });
  }
} 