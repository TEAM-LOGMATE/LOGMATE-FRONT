// src/TestPage.tsx
import React from 'react';
import BtnAddMember from './components/btn/btn-addmember';
import BtnRole from './components/btn/btn-role';
import BtnDelete from './components/btn/btn-delete';
import BtnX from './components/btn/btn-x';


export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-[#0F0F0F]">
      {/* 활성 상태 */}
      <BtnAddMember label="팀원 추가" disabled={false} />

      {/* 비활성 상태 */}
      <BtnAddMember label="팀원 추가" disabled={true} />

      {/* BtnRole 팀 관리자 */}
      <BtnRole role="teamAdmin" />

      {/* BtnRole 팀원 */}
      <BtnRole role="member" />

      {/* BtnRole 뷰어 */}
      <BtnRole role="viewer" />

      {/* 삭제하기 버튼 */}
      <BtnDelete/>

      {/* X 버튼 */}
      <BtnX onClick={() => console.log('X button clicked')} />
    </div>
  );
}
