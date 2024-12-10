'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';

interface AssemblyMember {
  deptCd: string;
  empNm: string;
  engNm: string;
  hjNm: string;
  jpgLink: string;
  origNm: string;
  reeleGbnNm: string;
  electionNum?: string;
  numKey: string;
  imgType?: string;
}

interface DetailInfo {
  empNm: string;
  origNm: string;
  engNm: string;
  hjNm: string;
  reeleGbnNm: string;
  electionNum: string;
  memTitle: string;
  assemEmail: string;
  assemHomep: string;
  assemTel: string;
  bthDate: string;
  polyNm: string;
  shrtNm: string;
  staff: string;
  secretary: string;
}

interface TabMenuProps {
  initialData: AssemblyMember[];
}

const MemberCard = ({ member, onDetailClick, isDarkMode }: { member: AssemblyMember; onDetailClick: (deptCd: string) => void; isDarkMode: boolean }) => (
  <div className={`p-4 border rounded-lg hover:shadow-lg transition-shadow ${
    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
  }`}>
    <div className="flex flex-row items-center gap-4">
      <Image src={`/assembly/${member.deptCd}.${member.imgType || 'jpg'}`} alt={member.empNm} width={100} height={50} className="rounded-lg" style={{ width: '100px', height: 'auto' }}  />
      <div className="flex flex-col overflow-hidden w-full sm:w-auto text-center sm:text-left">
        <p className={`font-medium text-3xl ${isDarkMode ? 'text-white' : 'text-black'}`}>{member.empNm}</p>
        <p className={`truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{member.origNm}</p>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{member.reeleGbnNm}</p>
        <button 
          onClick={() => onDetailClick(member.deptCd)}
          className="mt-2 px-4 py-2 bg-red-500 w-24 mx-auto sm:mx-0 text-white rounded hover:bg-red-600"
        >
          상세보기
        </button>
      </div>
    </div>
  </div>
);

const DetailModal = ({ isOpen, onClose, detailInfo, member, isLoading, isDarkMode }: { isOpen: boolean; onClose: () => void; detailInfo: DetailInfo | null; member?: AssemblyMember; isLoading: boolean; isDarkMode: boolean }) => {
  if (!isOpen) return null;

  const Skeleton = () => (
    <div className="animate-pulse">
      <div className={`w-[283px] h-[397px] mx-auto rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className="space-y-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="border-b py-2">
            <div className={`h-4 rounded w-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 rounded w-3/4 mt-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg max-h-[80vh] overflow-y-auto w-full max-w-2xl mx-4 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col gap-6">
            {member && (
              <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
                <div className="relative mx-auto w-[283px] h-[397px]">
                  <div className={`absolute inset-0 rounded-lg animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <Image 
                    src={`/assembly_high/${member.deptCd}.${member.imgType || 'jpg'}`}
                    alt={member.empNm}
                    width={283}
                    height={397}
                    className="rounded-lg object-cover"
                    priority
                    quality={100}
                    onLoadingComplete={(img) => {
                      img.parentElement?.querySelector('.animate-pulse')?.classList.add('hidden');
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex-grow">
              <h2 className={`text-2xl font-bold mb-4 text-center sm:text-left ${isDarkMode ? 'text-white' : 'text-black'}`}>의원 상세정보</h2>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries({
                  '이름:': `${member?.empNm || '-'} (${member?.engNm || '-'}) / ${member?.hjNm || '-'}`,
                  '당선이력:': `${detailInfo?.reeleGbnNm || '-'} (${detailInfo?.electionNum})`,
                  '당선구:': detailInfo?.origNm || '-',
                  '이메일:': detailInfo?.assemEmail || '-',
                  '소속위원회:': detailInfo?.shrtNm || '-',
                  '홈페이지:': detailInfo?.assemHomep || '-',
                  '전화번호:': detailInfo?.assemTel || '-',
                  '생년월일:': detailInfo?.bthDate ? `${detailInfo.bthDate.substring(2,4)}년${detailInfo.bthDate.substring(4,6)}월${detailInfo.bthDate.substring(6,8)}일${detailInfo.bthDate ? `(만 ${new Date().getFullYear() - parseInt(detailInfo.bthDate.substring(0,4))}세)` : ''}` : '-',
                  '정당:': detailInfo?.polyNm || '-',
                  '보좌관:': detailInfo?.staff || '-',
                  '비서관:': detailInfo?.secretary || '-',
                  '약력:': detailInfo?.memTitle || '-'
                }).map(([label, value]) => (
                  <div key={label} className={`border-b py-2 ${isDarkMode ? 'border-gray-700' : ''}`}>
                    <span className={`font-bold w-24 inline-block ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{label}</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-black'}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full sm:w-auto"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TabMenu({ initialData }: TabMenuProps) {
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'term' | 'region'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailInfo, setDetailInfo] = useState<DetailInfo | null>(null);
  const [selectedMember, setSelectedMember] = useState<AssemblyMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleDetailClick = async (deptCd: string, numKey: string) => {
    try {
      const member = initialData.find(m => m.deptCd === deptCd);
      setSelectedMember(member || null);
      setIsModalOpen(true);
      setIsLoading(true);
      
      const response = await fetch(`/api/member-detail?deptCd=${deptCd}&numKey=${numKey}`);
      const { xmlText } = await response.json();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const xmlToJson = (xml: Document) => {
        const item = xml.querySelector("item");
        if (!item) return null;
        
        return {
          memTitle: item.querySelector("memTitle")?.textContent || "",
          assemEmail: item.querySelector("assemEmail")?.textContent || "",
          assemHomep: item.querySelector("assemHomep")?.textContent || "",
          assemTel: item.querySelector("assemTel")?.textContent || "",
          reeleGbnNm: item.querySelector("reeleGbnNm")?.textContent || "",
          electionNum: item.querySelector("electionNum")?.textContent || "",
          empNm: item.querySelector("empNm")?.textContent || "",
          engNm: item.querySelector("engNm")?.textContent || "",
          hjNm: item.querySelector("hjNm")?.textContent || "",
          bthDate: item.querySelector("bthDate")?.textContent || "",
          origNm: item.querySelector("origNm")?.textContent || "",
          polyNm: item.querySelector("polyNm")?.textContent || "",
          shrtNm: item.querySelector("shrtNm")?.textContent || "",
          staff: item.querySelector("staff")?.textContent || "",
          secretary: item.querySelector("secretary")?.textContent || "",
        };
      };

      const data = xmlToJson(xmlDoc);
      if (data) {
        setDetailInfo(data);
      }
    } catch (error) {
      console.error('Error fetching detail info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 제외할 의원 목록
  const excludedMembers = ['김예지', '안철수', '김상욱'];
  
  // 제외 의원을 필터링한 데이터
  const filteredInitialData = initialData.filter(member => !excludedMembers.includes(member.empNm));

  // 지역 목록 생성 (전체 + 고유 지역 + 비례대표)
  const regions = ['전체', ...new Set(
    filteredInitialData
      .map(member => {
        if (member.origNm === '비례대표') {
          return '비례대표';
        }
        return member.origNm ? member.origNm.split(' ')[0] : '';
      })
      .filter(Boolean)
  )].filter(region => region !== '비례대표');
  regions.push('비례대표');

  // 선택된 지역과 검색어에 따라 데이터 필터링
  const getFilteredData = (region: string) => {
    let filtered = filteredInitialData;
    
    if (region !== '전체') {
      if (region === '비례대표') {
        filtered = filtered.filter(member => member.origNm === '비례대표');
      } else {
        filtered = filtered.filter(member => member.origNm?.startsWith(region));
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.empNm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.origNm.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬 로직 적용
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.empNm.localeCompare(b.empNm);
          break;
        case 'term':
          const getTermOrder = (term: string) => {
            if (term.includes('초선')) return 1;
            if (term.includes('재선')) return 2;
            if (term.includes('비례')) return 10;
            const num = parseInt(term.match(/\d+/)?.[0] || '0');
            return num > 0 ? num + 2 : 11;
          };
          comparison = getTermOrder(a.reeleGbnNm) - getTermOrder(b.reeleGbnNm);
          break;
        case 'region':
          comparison = a.origNm.localeCompare(b.origNm);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-7xl mx-auto px-2">
        <button
          onClick={toggleDarkMode}
          className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg ${
            isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
          }`}
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
        <h1 className={`text-2xl sm:text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <span className="font-bold">절대 잊어서는 안 될 내란의 공범</span> 국민의 힘 의원 105명 명단
        </h1>
        <div className="text-gray-500 text-sm mb-4">
          <Link href="https://petitions.assembly.go.kr/proceed/onGoingAll/288008C178403F22E064B49691C6967B" target="_blank" className="text-red-500 hover:underline">헌법과 법률을 유린한 국민의힘 정당 해산에 관한 청원</Link>
          <br/>
          <Link href="https://petitions.assembly.go.kr/proceed/onGoingAll/27F6E510218D1216E064B49691C6967B" target="_blank" className="text-red-500 hover:underline">대통령 윤석열 탄핵소추와 내란죄 수사를 위한 특검법 제정 촉구에 관한 청원</Link>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="이름 또는 지역으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-5/12 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 dark:text-white"
          />
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full sm:w-auto">
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg ${sortBy === 'name' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
            >
              이름순
            </button>
            <button
              onClick={() => setSortBy('term')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg ${sortBy === 'term' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
            >
              선수순
            </button>
            <button
              onClick={() => setSortBy('region')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg ${sortBy === 'region' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
            >
              지역순
            </button>
            <button
              onClick={toggleSortOrder}
              className="px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg bg-white text-gray-700"
            >
              {sortOrder === 'asc' ? '오름차순' : '내림차순'}
            </button>
          </div>
        </div>

        <Tab.Group selectedIndex={selectedRegion} onChange={setSelectedRegion}>
          <Tab.List className={`flex flex-wrap gap-2 rounded-xl p-2 shadow overflow-x-auto max-h-[200px] sm:max-h-none ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {regions.map((region) => (
              <Tab
                key={region}
                className={({ selected }) =>
                  `rounded-lg py-1.5 sm:py-2.5 text-sm font-medium leading-5 px-3 sm:px-4 whitespace-nowrap min-w-[100px] text-center
                  ${selected
                    ? 'bg-red-500 text-white shadow'
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {region === '전체' 
                  ? `전체 (${getFilteredData(region).length})`
                  : `${region} (${getFilteredData(region).length})`
                }
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {regions.map((region, idx) => (
              <Tab.Panel
                key={idx}
                className="rounded-xl bg-white/50 p-2 sm:p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                  {getFilteredData(region).map((member, index) => (
                    <MemberCard 
                      key={index} 
                      member={member} 
                      onDetailClick={() => handleDetailClick(member.deptCd, member.numKey)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
      <DetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        detailInfo={detailInfo}
        member={selectedMember || undefined}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
