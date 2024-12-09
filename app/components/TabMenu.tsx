'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
interface AssemblyMember {
  deptCd: string;
  empNm: string;
  engNm: string;
  hjNm: string;
  jpgLink: string;
  origNm: string;
  reeleGbnNm: string;
  imgType?: string;
}

interface TabMenuProps {
  initialData: AssemblyMember[];
}

const MemberCard = ({ member }: { member: AssemblyMember }) => (
  <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white">
    <div className="flex flex-row items-center gap-4">
      <Image src={`/assembly/${member.deptCd}.${member.imgType || 'jpg'}`} alt={member.empNm} width={100} height={100} />
      <div className="flex flex-col">
        <p className="font-medium text-3xl text-black">{member.empNm}</p>
        <p className="text-gray-600">{member.origNm}</p>
        <p className="text-gray-500">{member.reeleGbnNm}</p>
      </div>
    </div>
  </div>
);

export default function TabMenu({ initialData }: TabMenuProps) {
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'term' | 'region'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
          // 선수 정렬 로직 변경
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-black"><span className="font-bold">절대 잊어서는 안 될 내란의 공범</span> 국민의 힘 의원 105명 명단</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="이름 또는 지역으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg ${sortBy === 'name' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              이름순
            </button>
            <button
              onClick={() => setSortBy('term')}
              className={`px-4 py-2 rounded-lg ${sortBy === 'term' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              선수순
            </button>
            <button
              onClick={() => setSortBy('region')}
              className={`px-4 py-2 rounded-lg ${sortBy === 'region' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              지역순
            </button>
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 rounded-lg bg-white text-gray-700"
            >
              {sortOrder === 'asc' ? '오름차순' : '내림차순'}
            </button>
          </div>
        </div>

        <Tab.Group selectedIndex={selectedRegion} onChange={setSelectedRegion}>
          <Tab.List className="flex flex-wrap space-x-2 rounded-xl bg-white p-1 shadow">
            {regions.map((region) => (
              <Tab
                key={region}
                className={({ selected }) =>
                  `rounded-lg py-2.5 text-sm font-medium leading-5 px-4
                  ${selected
                    ? 'bg-blue-500 text-white shadow'
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
                className="rounded-xl bg-white/50 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredData(region).map((member, index) => (
                    <MemberCard key={index} member={member} />
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
