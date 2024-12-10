import { useEffect } from 'react';
import Link from 'next/link';
import CountUp from 'react-countup';
import { useWebSocket } from '../hooks/useWebSocket';

interface PetitionStatus {
  status: number;
  timestamp: string;
}

interface PetitionStatusProps {
  isDarkMode: boolean;
}

export default function PetitionStatus({ isDarkMode }: PetitionStatusProps) {
  const { isConnected, data: wsData, sendMessage } = useWebSocket('wss://kick-yoon.com/websocket');

  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'GET_MEMBERS' });
    }
  }, [isConnected, sendMessage]);

  return (
    <div className={`flex flex-col gap-4 p-6 mb-6 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}>
      <div className="flex flex-col gap-2">
        <Link 
          href="https://petitions.assembly.go.kr/proceed/onGoingAll/288008C178403F22E064B49691C6967B" 
          target="_blank" 
          className="text-lg font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
        >
          📜 헌법과 법률을 유린한 국민의힘 정당 해산에 관한 청원
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          실시간 동의 <span className="font-bold text-lg mr-1 text-red-500">
            {wsData && (
              <CountUp 
                end={wsData.red?.status || 0}
                separator=","
                duration={2}
                preserveValue={true}
                start={0}
              />
            )}
          </span>명
          <span className="text-gray-500 ml-2">
            ({new Date(wsData?.red?.timestamp || Date.now()).toLocaleString('ko-KR')} 기준)
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Link 
          href="https://petitions.assembly.go.kr/proceed/onGoingAll/27F6E510218D1216E064B49691C6967B" 
          target="_blank"
          className="text-lg font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
        >
          ⚖️ 대통령 윤석열 탄핵소추와 내란죄 수사를 위한 특검법 제정 촉구에 관한 청원
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          실시간 동의 <span className="font-bold text-lg mr-1 text-red-500">
            {wsData && (
              <CountUp 
                end={wsData.yoon?.status || 0}
                separator=","
                duration={2}
                preserveValue={true}
                start={0}
              />
            )}
          </span>명
          <span className="text-gray-500 ml-2">
            ({new Date(wsData?.yoon?.timestamp || Date.now()).toLocaleString('ko-KR')} 기준)
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lg font-medium text-red-600 hover:text-red-700 hover:underline transition-colors">⏳ 대기 인원 표시</span>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          대기 인원 <span className="font-bold text-lg mr-1 text-red-500">
            {wsData && (
              <CountUp 
                end={wsData?.WaitCount?.nwait || 0}
                separator=","
                duration={2}
                preserveValue={true}
                start={0}
              />
            )}
          </span>명
          <span className="text-gray-500 ml-2">
            ({new Date(wsData?.WaitCount?.timestamp || Date.now()).toLocaleString('ko-KR')} 기준)
          </span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          남은 시간 <span className="font-bold text-lg mr-1 text-red-500">
            {Math.max(0, Math.floor((wsData?.WaitCount?.real_time_left || 0) / 60))}분 {Math.max(0, (wsData?.WaitCount?.real_time_left || 0) % 60)}초
          </span>
        </p>
      </div>
      <p className="text-sm text-right text-gray-600 dark:text-gray-300">
        자료 제공 <Link href="https://kick-yoon.com/" target="_blank" className="text-blue-500 hover:underline">https://kick-yoon.com/</Link>
      </p>
    </div>
  );
} 