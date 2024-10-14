<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axiosInstance from '@/api/instance';
 
      const router = useRouter();
      const route = useRoute();
  
      const handleOAuthKakao = async (token : string, role : string) => {
        try {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('role', role);
          console.log(route);
          await router.push('/login/member')
          //console.log(login.isLoggedIn);
        } catch (error) {
          console.log(error);
          await router.push('/login');
        }
      };
  
      onMounted(() => {
        const token = route.query.accessToken?.toString() ?? "";
        const role = route.query.role?.toString()  ?? "";
        const state = route.query.state?.toString();
        localStorage.setItem("accessToken", token);
        if(state === "user") {
            router.push('/');
            return;
        }
        else if(state === "chemist") {
            router.push('/pharmacist');
            return;
        }
        else if(state === "doctor") {
            router.push('/doctor');
            return;
        } 
        else if(state === "register"){
            handleOAuthKakao(token, role);
        }

        else {
          alert("다시시도.");
          router.push('/login');
        }
      });

  </script>
  
  <template>
      <div>
        <div>Processing...</div>
      </div>
  </template>
    
  <style scoped>
  /* 스타일을 여기에 추가할 수 있습니다 */
  </style>
  