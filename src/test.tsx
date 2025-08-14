import BtnAddMember from './components/btn/btn-addmember';
import BtnRole from './components/btn/btn-role';
import BtnDelete from './components/btn/btn-delete';
import BtnX from './components/btn/btn-x';
import BtnInviteLink from './components/btn/btn-invitelink';
import MemberEM from './components/input/memberEM';
import FrmMemberLine from './components/frm/frm-memberline';
import FrmMemberList from './components/frm/frm-memberlist';
import FrmMakeTeam from './components/frm/frm-maketeam';

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
      <BtnX />

      {/* 초대 링크 버튼 기본 */}
      <BtnInviteLink/>
      {/* 초대 링크 버튼 회색 배경 */}
      <BtnInviteLink variant="variant2" />

      {/* 멤버 이메일 입력 필드 */}
      <MemberEM placeholder="초대할 팀원의 이메일을 입력하세요"/>

      <MemberEM placeholder="초대할 팀원의 이메일을 입력하세요" variant = "variant2"/>
        
      {/* 멤버 라인 */}
      <FrmMemberLine
        name="팀원명"
        email="nunnifer07@gmail.com"
        role="member"
        onRoleChange={() => alert('역할 변경 클릭')}
        onDeleteClick={() => alert('삭제 클릭')}
      />

      <FrmMemberList
        members={[
          { name: '김철수', email: 'chulsoo@example.com', role: 'teamAdmin' },
          { name: '이영희', email: 'younghee@example.com', role: 'member' },
          { name: '박민수', email: 'minsoo@example.com', role: 'viewer' },
        ]}
        onMemberAdd={(email) => console.log('Add member:', email)}
        onRoleChange={(index) => console.log('Role change for member index:', index)}
        onDeleteClick={(index) => console.log('Delete member index:', index)}
      />
      {/* 멤버 리스트 */}
      <FrmMakeTeam onSubmit={(data) => console.log('팀 생성 데이터:', data)} />
    </div>
  );
}
