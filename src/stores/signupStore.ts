import { defineStore } from 'pinia';
import axiosInstance from '@/api/instance';

interface CommonInfo {
  name: string;
  phoneNumber: string;
  phoneCarrier: string;
  residentNumber: string;
}

interface PatientInfo {
  bankName: string;
  accountNumber: string;
  accountPassword: string;
}

interface DoctorInfo {
  hospitalName: string;
  hospitalAddress: {
    city: string;
    district: string;
    neighborhood: string;
    detail: string;
  };
  hospitalType: string;
  licenseNumber: string;
  representativeName: string;
  hospitalPhone: string;
}

interface PharmacistInfo {
  pharmacyName: string;
  pharmacyAddress: {
    city: string;
    district: string;
    neighborhood: string;
    detail: string;
  };
  licenseNumber: string;
  representativeName: string;
  pharmacyPhone: string;
}

interface Terms {
  service: boolean;
  privacy: boolean;
  marketing: boolean;
}

export const useSignupStore = defineStore('signup', {
  state: () => ({
    memberType: '',
    commonInfo: {} as CommonInfo,
    patientInfo: {} as PatientInfo,
    doctorInfo: {} as DoctorInfo,
    pharmacistInfo: {} as PharmacistInfo,
    terms: {} as Terms
  }),
  actions: {
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
      if (userInfo.memberType) this.memberType = userInfo.memberType;
      if (userInfo.commonInfo) Object.assign(this.commonInfo, userInfo.commonInfo);
      if (userInfo.patientInfo) Object.assign(this.patientInfo, userInfo.patientInfo);
      if (userInfo.doctorInfo) Object.assign(this.doctorInfo, userInfo.doctorInfo);
      if (userInfo.pharmacistInfo) Object.assign(this.pharmacistInfo, userInfo.pharmacistInfo);
      if (userInfo.terms) Object.assign(this.terms, userInfo.terms);
    },
    resetState() {
      this.$reset();
    },
    async submitSignup() {
      try {
        let endpoint = '';
        let data: any = { ...this.commonInfo };

        switch (this.memberType) {
          case '일반 회원':
            endpoint = '/api/patient/register';
            data = { ...data, ...this.patientInfo };
            break;
          case '의사':
            endpoint = '/api/hospital/register';
            data = { ...data, ...this.doctorInfo };
            break;
          case '약사':
            endpoint = '/api/pharmacy/register';
            data = { ...data, ...this.pharmacistInfo };
            break;
          default:
            throw new Error('잘못된 회원 유형입니다.');
        }

        data.terms = this.terms;

        // console.log(endpoint);
        // console.log(data);
        const response = await axiosInstance.post(endpoint, data);
        if (response.data.success) {
          console.log('회원가입에 성공했어요', response.data);
          this.resetState(); // 상태 초기화
          return { success: true, nextRoute: this.getNextRoute() };
        } else {
          throw new Error(response.data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입에 실패했어요', error);
        return { success: false, nextRoute: '' };
      }
    },
    getNextRoute() {
      switch (this.memberType) {
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
  persist: true
});
