import Image from 'next/image';
import { AssemblyMember } from '../types/index';

interface MemberCardProps {
  member: AssemblyMember;
  onDetailClick: (deptCd: string) => void;
  isDarkMode: boolean;
}

export const MemberCard = ({ member, onDetailClick, isDarkMode }: MemberCardProps) => (
  <div className={`p-4 border rounded-lg hover:shadow-lg transition-shadow ${
    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
  }`}>
    <div className="flex flex-row items-center gap-4">
      <Image 
        src={`/assembly/${member.deptCd}.${member.imgType || 'jpg'}`} 
        alt={member.empNm} 
        width={100} 
        height={50} 
        className="rounded-lg" 
        style={{ width: '100px', height: 'auto' }} 
      />
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