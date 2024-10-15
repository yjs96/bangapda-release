import { defineStore } from 'pinia';
import { useTokenStore } from './tokenControl';
import axiosInstance from '@/api/instance';

// 회원 정보 관련 인터페이스 정의
interface CommonInfo {
  userNm: string;
  phoneNo: string;
  phoneCarrier: string;
  firstNo: string;
  lastNo: string;
}

interface PatientInfo {
  bankNm: string;
  accountNo: string;
  accountPw: string;
  fcmNo: string | null;
}

interface DoctorInfo {
  doctorNo: string;
  hospitalAddress: {
    city: string;
    district: string;
    neighborhood: string;
    detail: string;
  };
  tp: string;
  hospitalDong: string;
  hospitalDetailAdress: string;
  hospitalNm: string;
  hospitalType: string;
  hospitalPhoneNo: string;
  representativeName: string;
}

interface PharmacistInfo {
  chemistNo: string;
  pharmacyAddress: {
    city: string;
    district: string;
    neighborhood: string;
    detail: string;
  };
  pharmacyDong: string;
  pharmacyDetailAddress: string;
  pharmacyNm: string;
  pharmacyPhoneNo: string;
  representativeName: string;
}

// 약관 동의 인터페이스 수정
interface Terms {
  service: boolean;
  ePrescription: boolean;
  notification: boolean;
}

// Pinia 스토어 정의
export const useSignupStore = defineStore('signup', {
  // 스토어의 초기 상태 정의
  state: () => ({
    memberType: '',
    commonInfo: {} as CommonInfo,
    patientInfo: {} as PatientInfo,
    doctorInfo: {} as DoctorInfo,
    pharmacistInfo: {} as PharmacistInfo,
    terms: {} as Terms
  }),

  actions: {
    // 사용자 정보를 설정하는 액션
    setUserInfo(
      userInfo: Partial<{
        memberType: string;
        commonInfo: Partial<CommonInfo>;
        patientInfo: Partial<PatientInfo>;
        doctorInfo: Partial<DoctorInfo>;
        pharmacistInfo: Partial<PharmacistInfo>;
        terms: Partial<Terms>;
      }>
    ) {
      // 각 정보 타입별로 존재하는 경우에만 상태 업데이트
      if (userInfo.memberType) this.memberType = userInfo.memberType;
      if (userInfo.commonInfo) Object.assign(this.commonInfo, userInfo.commonInfo);
      if (userInfo.patientInfo) Object.assign(this.patientInfo, userInfo.patientInfo);
      if (userInfo.doctorInfo) Object.assign(this.doctorInfo, userInfo.doctorInfo);
      if (userInfo.pharmacistInfo) Object.assign(this.pharmacistInfo, userInfo.pharmacistInfo);
      if (userInfo.terms) Object.assign(this.terms, userInfo.terms);
    },

    // 스토어 상태를 초기화하는 액션
    resetState() {
      this.$reset();
    },

    // 회원가입 제출 액션
    async submitSignup() {
      const token = sessionStorage.getItem('token');
      try {
        let endpoint = '';
        let data: any = { ...this.commonInfo };

        // 회원 유형에 따라 엔드포인트와 데이터 설정
        switch (this.memberType) {
          case '일반 회원':
            endpoint = '/api/auth/register/user';
            data = { ...data, ...this.patientInfo };
            break;
          case '의사':
            console.log(data);
            console.log(this.doctorInfo);
            endpoint = '/api/auth/register/doctor';
            data = { ...data, ...this.doctorInfo };
            break;
          case '약사':
            endpoint = '/api/auth/register/chemist';
            data = { ...data, ...this.pharmacistInfo };
            break;
          default:
            throw new Error('잘못된 회원 유형입니다.');
        }

        // 약관 동의 정보 추가 (알림 수신 동의 포함)
        data.terms = this.terms;
        // API 요청 전송
        const response = await axiosInstance.post(endpoint, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          console.log(response);
          localStorage.setItem('accessToken', response.data.data.accessToken);
          const tokenStorage = useTokenStore();
          tokenStorage.setToken(response.data.data.accessToken);

          console.log('회원가입에 성공했어요');
          const type = this.memberType;

          // this.resetState(); // 상태 초기화

          return { success: true, nextRoute: this.getNextRoute(type) };
        } else {
          throw new Error(response.data.error || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입에 실패했어요', error);
        return { success: false, nextRoute: '' };
      }
    },

    // 회원 유형에 따른 다음 라우트 반환
    getNextRoute(member: string = '일반 회원') {
      switch (member) {
        case '일반 회원':
          return '/';
        case '의사':
          return '/doctor';
        case '약사':
          return '/pharmacist';
        default:
          return '/';
      }
    }
  },

  // 상태 지속성 설정 (로컬 스토리지에 저장)
  persist: true
});
