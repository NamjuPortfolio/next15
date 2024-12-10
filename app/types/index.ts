export interface AssemblyMember {
  deptCd: string;
  empNm: string;
  engNm: string;
  hjNm: string;
  jpgLink: string;
  address: string;
  sns?: {
    blog: string;
    youtube: string;
    facebook: string;
    instagram: string;
    channel: string;
  };
  origNm: string;
  reeleGbnNm: string;
  electionNum?: string;
  numKey: string;
  imgType?: string;
}

export interface DetailInfo {
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