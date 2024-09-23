<script setup lang="ts">
import HeadBar from '@/components/HeadBar.vue';
import NavBar from '@/components/NavBar.vue';
import Main from '@/components/Main.vue';

import {
  Dialog,
  // DialogHeader,
  // DialogDescription,
  // DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'


import { Button } from '@/components/ui/button';
import { ref } from 'vue';

const prescDetail = [
  {
    key: '병원명',
    value: '김성현내과의원'
  },
  {
    key: '의사명',
    value: '김성현'
  },
  {
    key: '약국명',
    value: '무슨무슨약국'
  },
  {
    key: '약사명',
    value: '임준수'
  },
  {
    key: '작성일',
    value: '2024. 09. 13'
  },
  {
    key: '처방약',
    value: '3개'
  },
]


const showMedicine = ref(false);

</script>

<template>
  <HeadBar :back-button="true">상세보기</HeadBar>
  <NavBar />
  <Main :headbar="true" :navbar="true" :padded="true">
    <div class="misc-func-frame">
      <div class="misc-func-container">
        <div class="misc-func-left">
          <div class="icon-frame">
            <!-- 아이콘 -->
          </div>
          <div class="misc-info-text">
            <span class="misc-info-title">보험금 간편 청구</span>
            <span class="misc-info-desc">{서비스명}이 복잡한 과정을 대신 해드려요</span>
          </div>
        </div>
        <Button>신청</Button>
      </div>
      <div class="misc-func-container">
        <div class="misc-func-left">
          <div class="icon-frame">
            <!-- 아이콘 -->
          </div>
          <div class="misc-info-text">
            <span class="misc-info-title">약 수령 확인</span>
            <span class="misc-info-desc">{서비스명}을 사용하지 않았어도 바꿀 수 있어요</span>
          </div>
        </div>
        <Button variant="destructive">완료</Button>
      </div>
    </div>
    <div class="presc-title">처방전 상세</div>
    <div class="detail-frame">
      <div class="detail-container" v-for="info in prescDetail" :key="info.key">
        <span>{{ info.key }}</span>
        <div>
          {{ info.value }}
          <i v-if="info.key == '처방약'" class="fa-solid fa-caret-down" @click="showMedicine = !showMedicine"></i>
          <div v-if="showMedicine && info.key =='처방약'">dddd</div>
        </div>
      </div>
    </div>
    <div class="seperator"></div>
    <Dialog>
      <DialogTrigger class="docu-button">
          <span>처방전 보기</span>
          <i class="fa-solid fa-chevron-right"></i>
      </DialogTrigger>
      <DialogContent>
        <div>
          
        </div>
        <DialogFooter class="modal-footer">
          <Button size="lg">이미지로 저장</Button>
          <DialogClose>
            <Button variant="destructive" size="lg">닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog>
      <DialogTrigger class="docu-button">
          <span>전자영수증 보기</span>
          <i class="fa-solid fa-chevron-right"></i>
      </DialogTrigger>
      <DialogContent>
        <Carousel>
          <CarouselContent class="carousel-frame">
            <CarouselItem>
              <div class="receipt-frame">
                <div class="receipt-store">김성헌내과의원</div>
                <div>
                  <span class="receipt-price">10,000</span>
                  <span class="won">원</span>
                </div>
              </div>
              <div class="receipt-top">
                <div class="receipt-info-line">
                  <div class="receipt-info-left">승인일시</div>
                  <div>2024-09-23 11:19</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">거래유형</div>
                  <div>승인</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">할부</div>
                  <div>일시불</div>
                </div>
              </div>
              <div class="receipt-top dotted-top">
                <div class="receipt-info-line">
                  <div class="receipt-info-left">공급가액</div>
                  <div>9,091원</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">부가세</div>
                  <div>909원</div>
                </div>
              </div>
              <div class="receipt-top dotted-top" style="margin-bottom: 18px">
                <div class="receipt-info-line">
                  <div class="receipt-info-left">가맹점명</div>
                  <div>김성헌내과의원</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">사업자번호</div>
                  <div>123-456-7890</div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div class="receipt-frame">
                <div class="receipt-store">김성헌약국</div>
                <div>
                  <span class="receipt-price">10,000</span>
                  <span class="won">원</span>
                </div>
              </div>
              <div class="receipt-top">
                <div class="receipt-info-line">
                  <div class="receipt-info-left">승인일시</div>
                  <div>2024-09-23 11:19</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">거래유형</div>
                  <div>승인</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">할부</div>
                  <div>일시불</div>
                </div>
              </div>
              <div class="receipt-top dotted-top">
                <div class="receipt-info-line">
                  <div class="receipt-info-left">공급가액</div>
                  <div>9,091원</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">부가세</div>
                  <div>909원</div>
                </div>
              </div>
              <div class="receipt-top dotted-top" style="margin-bottom: 18px">
                <div class="receipt-info-line">
                  <div class="receipt-info-left">가맹점명</div>
                  <div>김성헌약국</div>
                </div>
                <div class="receipt-info-line">
                  <div class="receipt-info-left">사업자번호</div>
                  <div>123-456-7890</div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <DialogFooter class="modal-footer">
          <Button size="lg">이미지로 저장</Button>
          <DialogClose>
            <Button variant="destructive" size="lg">닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Main>
</template>

<style scoped>
.misc-func-frame {
  margin-top: 24px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.misc-func-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.misc-func-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-frame {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background-color: var(--gray);
  display: flex;
  justify-content: center;
  align-items: center;
}

.misc-info-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.misc-info-title {
  font-size: 16px;
  font-weight: 550;
}

.misc-info-desc {
  font-size: 12px;
  color: var(--dark-gray);
}

.presc-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.detail-frame {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 32px;
}

.detail-container {
  display: flex;
  justify-content: space-between;

  div {
    font-size: 16px;
    color: var(--dark-gray);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  span {
    font-size: 18px;
    font-weight: 550;
  }
}

.seperator {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid var(--gray);
  margin-bottom: 16px;
}

.docu-button-frame {
  width: 100%;
}

.docu-button {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-size: 20px;
    font-weight: 600
  }
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.carousel-frame {
  display: flex;
  justify-content: center;
  width: calc(100% - 80px);
}

.receipt-frame {
  width: calc(100% - 32px);
  position: relative;
  margin-bottom: 32px;
  margin-top: 12px;
}

.receipt-store {
  font-size: 15px;
  font-weight: 550;
  margin-bottom: -5px;
}

.receipt-price {
  font-size: 28px;
  font-weight: 600;
}

.won {
  font-size: 18px;
  font-weight: 600;
  margin-left: 1.5px;
}

.receipt-top {
  width: calc(100% - 32px);
  border-top: 2px solid var(--black);
  padding: 20px 4px 16px 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.receipt-info-line {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
}

.receipt-info-left {
  font-weight: 400;
  font-size: 14px;
  color: var(--dark-gray)
}

.dotted-top {
  border-top: 2px dotted var(--dark-gray);
}
</style>