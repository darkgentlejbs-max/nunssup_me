import { ShopConfig, ServiceItem, Customer, Appointment, TimeBlock } from '../types';

export const initialShopConfig: ShopConfig = {
  "name": "눈썹 : 미 眉",
  "phone": "010.3797.7721",
  "notice": "100% 예약제 운영 중입니다. 당일 예약 및 상담 문의는 부재 시 문자를 남겨주시면 시술 후 순차적으로 연락드립니다.",
  "address": "전남광주통합특별시 여수시 문수로 148, 1층(문수동)",
  "bankInfo": "카카오뱅크 3333-01-2345678 (예금주: 눈썹미)",
  "dayHours": [
    {
      "end": "19:00",
      "start": "10:00"
    },
    {
      "end": "19:00",
      "start": "10:00"
    },
    {
      "end": "19:00",
      "start": "10:00"
    },
    {
      "end": "19:00",
      "start": "10:00"
    },
    {
      "end": "21:00",
      "start": "10:00"
    },
    {
      "end": "21:00",
      "start": "10:00"
    },
    {
      "end": "21:00",
      "start": "10:00"
    }
  ],
  "subtitle": "nunssup_me",
  "instagram": "@nunssup_me",
  "closedDays": [
    2
  ],
  "weekdayHours": {
    "end": "19:00",
    "start": "10:00"
  },
  "weekendHours": {
    "end": "21:00",
    "start": "10:00"
  },
  "depositAmount": 20000,
  "slotIntervalMinutes": 30,
  "adminPin": "7721"
};

export const initialServices: ServiceItem[] = [
  {
    "id": "srv-1",
    "tag": "대표 시그니처",
    "name": "여자 자연눈썹 (엠보)",
    "price": 160000,
    "popular": true,
    "category": "눈썹",
    "description": "본인 눈썹 결을 한 올 한 올 살려 원래 내 눈썹처럼 자연스러운 결을 완성하는 시그니처 시술",
    "recommendedFor": "모량이 적당하고 자연스러운 쌩얼 눈썹을 원하시는 분",
    "durationMinutes": 90
  },
  {
    "id": "srv-2",
    "tag": "만족도 1위",
    "name": "여자 콤보눈썹 (결+섀도우)",
    "price": 180000,
    "popular": true,
    "category": "눈썹",
    "description": "앞머리는 자연스러운 엠보 결로, 꼬리와 숱이 부족한 부분은 부드러운 섀도우 그라데이션으로 풍성하게 채우는 입체적 시술",
    "recommendedFor": "눈썹 숱이 적거나 붉은 잔흔이 남아있는 분",
    "durationMinutes": 90
  },
  {
    "id": "srv-3",
    "tag": "남성 전용",
    "name": "남자 맞춤 결눈썹",
    "price": 180000,
    "popular": true,
    "category": "눈썹",
    "description": "남성 골격과 눈썹 근육의 움직임에 맞춘 티 나지 않는 또렷하고 단정한 맨즈 텍스처 디자인",
    "recommendedFor": "인상이 흐릿해 보이거나 면접/웨딩을 앞두신 남성분",
    "durationMinutes": 90
  },
  {
    "id": "srv-4",
    "tag": "통증 최소화",
    "name": "무통 점막 아이라인",
    "price": 120000,
    "popular": false,
    "category": "아이라인",
    "description": "속눈썹 사이사이 점막을 꼼꼼히 채워 붓기 없이 또렷하고 깊이 있는 눈매를 연출",
    "recommendedFor": "아이라인 그리기 번거롭거나 점막이 들려 보이는 분",
    "durationMinutes": 90
  },
  {
    "id": "srv-5",
    "tag": "생기 충전",
    "name": "생기 틴트 입술 (립 블러셔)",
    "price": 250000,
    "popular": true,
    "category": "입술",
    "description": "어둡고 칙칙한 입술 톤을 보정하고 화사한 수채화 물광 틴트 발색을 선사하는 립 디자인",
    "recommendedFor": "입술에 생기가 없거나 입술 라인이 불분명한 분",
    "durationMinutes": 120
  },
  {
    "id": "srv-6",
    "tag": "간편 시술",
    "name": "포인트 미인점",
    "price": 30000,
    "popular": false,
    "category": "미인점",
    "description": "코, 볼, 눈가 등 얼굴의 장점을 극대화하는 매력적인 자연스러운 미인점 연출",
    "recommendedFor": "얼굴의 여백을 줄이고 포인트를 주고 싶으신 분",
    "durationMinutes": 30
  },
  {
    "id": "srv-7",
    "tag": "재예약률 95%",
    "name": "블랙 케라틴 영양 속눈썹 펌",
    "price": 40000,
    "popular": true,
    "category": "속눈썹",
    "description": "고농축 케라틴 영양제와 블랙 틴팅으로 속눈썹 손상 없이 바짝 올라가는 또렷한 C/L컬 펌",
    "recommendedFor": "뷰러를 해도 금방 처지거나 잦은 마스카라가 번거로운 분",
    "durationMinutes": 60
  },
  {
    "id": "srv-8",
    "tag": "이물감 Zero",
    "name": "프리미엄 볼륨 속눈썹 연장",
    "price": 65000,
    "popular": false,
    "category": "속눈썹",
    "description": "초경량 프리미엄 플랫모로 이물감 없이 풍성하고 그윽한 인형 눈매 완성",
    "recommendedFor": "풍성한 볼륨감과 화려한 눈매를 선호하시는 분",
    "durationMinutes": 90
  },
  {
    "id": "srv-1788004607592",
    "name": "노글루펌",
    "price": 35000,
    "category": "속눈썹",
    "description": "",
    "recommendedFor": "",
    "durationMinutes": 60
  },
  {
    "id": "srv-1788004635526",
    "name": "클래식연장",
    "price": 45000,
    "category": "속눈썹",
    "description": "",
    "recommendedFor": "",
    "durationMinutes": 90
  },
  {
    "id": "srv-1788360793390",
    "name": "펌+영양제",
    "price": 70000,
    "category": "속눈썹",
    "description": "",
    "recommendedFor": "",
    "durationMinutes": 60
  },
  {
    "id": "srv-1788433977218",
    "name": "포인트연장",
    "price": 55000,
    "category": "속눈썹",
    "description": "",
    "recommendedFor": "",
    "durationMinutes": 90
  },
  {
    "id": "srv-1788501048574",
    "name": "연장리터치",
    "price": 30000,
    "category": "눈썹",
    "description": "원장님 수동 추가 시술",
    "recommendedFor": "모든 고객",
    "durationMinutes": 60
  },
  {
    "id": "srv-1788569399997",
    "name": "바비래쉬",
    "price": 55000,
    "category": "눈썹",
    "description": "원장님 수동 추가 시술",
    "recommendedFor": "모든 고객",
    "durationMinutes": 90
  },
  {
    "id": "srv-1789548402865",
    "name": "YY래쉬",
    "price": 45000,
    "category": "눈썹",
    "description": "원장님 수동 추가 시술",
    "recommendedFor": "모든 고객",
    "durationMinutes": 60
  }
];

export const initialCustomers: Customer[] = [
  {
    "id": "cust-1791358022036",
    "name": "이한울",
    "grade": "신규",
    "phone": "010-2965-9004",
    "history": [],
    "createdAt": "2026-10-07",
    "totalSpent": 0,
    "totalVisits": 0
  },
  {
    "id": "cust-1791011867445",
    "name": "박승자",
    "grade": "신규",
    "phone": "010-3101-0363",
    "history": [
      {
        "id": "hist-1791011944451",
        "date": "2026-10-03",
        "notes": "라인이 검게 착색이 있음\n주황색 톤업 \n레드2:핑크5",
        "price": 250000,
        "technique": "",
        "afterImage": "",
        "afterImages": [],
        "beforeImage": "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1791020853800-syfc49jg5wq.jpeg",
        "serviceName": "생기 틴트 입술 (립 블러셔)",
        "beforeImages": [
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1791020853800-syfc49jg5wq.jpeg",
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1791020855121-ds288yvvnl5.jpeg",
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1791020856548-gczs236snow.jpeg"
        ],
        "pigmentColor": ""
      }
    ],
    "createdAt": "2026-10-03",
    "totalSpent": 250000,
    "totalVisits": 1,
    "lastVisitDate": "2026-10-03"
  },
  {
    "id": "cust-1790870086830",
    "name": "박수정",
    "grade": "신규",
    "phone": "010-9430-5469",
    "history": [
      {
        "id": "hist-1790870093931",
        "date": "2026-09-30",
        "notes": "첫 방문\n타샵에서 계속 연장했었는데 모가 거칠고 불편해서 옮길 예정 / 불편해서 비볐다함 속눈썹 많이 빠지고 끊김\n완전 자연스럽게\n유리c 6-8",
        "price": 45000,
        "technique": "",
        "afterImage": "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870341412-kc57tyjiaa9.jpeg",
        "afterImages": [
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870341412-kc57tyjiaa9.jpeg",
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870342069-bj9km2zk99w.jpeg"
        ],
        "beforeImage": "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870334196-dlpswcjzyrw.jpeg",
        "serviceName": "클래식연장",
        "beforeImages": [
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870334196-dlpswcjzyrw.jpeg",
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870334891-8un988ojovb.jpeg"
        ],
        "pigmentColor": ""
      }
    ],
    "createdAt": "2026-10-02",
    "totalSpent": 45000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-30"
  },
  {
    "id": "cust-1790038229559",
    "name": "박나래",
    "grade": "신규",
    "phone": "010-5664-7883",
    "history": [
      {
        "id": "hist-1790869984752",
        "date": "2026-09-28",
        "notes": "yy D 8-10 s",
        "price": 45000,
        "serviceName": "YY래쉬"
      }
    ],
    "createdAt": "2026-09-22",
    "totalSpent": 45000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-28"
  },
  {
    "id": "cust-1789975933334",
    "name": "김라연",
    "grade": "신규",
    "phone": "010-8003-0739",
    "history": [
      {
        "id": "hist-1789982517910",
        "date": "2026-09-21",
        "notes": "왼쪽 앞머리 빨리풀림\n모가 많이 짧음  M컬 s",
        "price": 35000,
        "serviceName": "노글루펌"
      }
    ],
    "createdAt": "2026-09-21",
    "totalSpent": 35000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-21"
  },
  {
    "id": "cust-1789548402865",
    "name": "신세희",
    "grade": "신규",
    "phone": "010-4072-0031",
    "history": [
      {
        "id": "hist-1789872127379",
        "date": "2026-09-20",
        "notes": "Y C 8-12",
        "price": 45000,
        "serviceName": "YY래쉬"
      }
    ],
    "createdAt": "2026-09-16",
    "totalSpent": 45000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-20"
  },
  {
    "id": "cust-1789548240837",
    "name": "김보령",
    "grade": "신규",
    "phone": "010-5579-7827",
    "history": [
      {
        "id": "hist-1789548248120",
        "date": "2026-09-16",
        "notes": "펌포(55)연장 원함\n\n30분 늦춰서 30-50퍼로 연장해드림\n맘에 들어하심\nM컬 L 포인트 픽서 사용\n롱타임 투명 구매",
        "price": 585000,
        "serviceName": "펌포인트 + 롱타임투명"
      }
    ],
    "createdAt": "2026-09-16",
    "totalSpent": 585000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-16"
  },
  {
    "id": "cust-1789224113181",
    "name": "이나영",
    "grade": "신규",
    "phone": "010-8220-7393",
    "history": [
      {
        "id": "hist-1789361700569",
        "date": "2026-09-13",
        "notes": "김진영님 소개\n\n▊성함 : 이나영\n▊연락처 : 01082207393\n▊날짜/시간 : 내일 6시\n▊연장/펌/눈썹 : 연장\n▊타샵연장제거O/X : O\n▊첫or재방문 : 첫방문\n▊요청사항 :9에서 10미리함께붙이고싶어여",
        "price": 45000,
        "serviceName": "클래식연장"
      }
    ],
    "createdAt": "2026-09-12",
    "totalSpent": 45000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-13"
  },
  {
    "id": "cust-1789126661086",
    "name": "손정빈",
    "grade": "신규",
    "phone": "010-5814-7725",
    "history": [],
    "createdAt": "2026-09-11",
    "totalSpent": 0,
    "totalVisits": 0
  },
  {
    "id": "cust-1789099896048",
    "name": "김현영",
    "grade": "신규",
    "phone": "010-6682-0806",
    "history": [
      {
        "id": "hist-1789361645644",
        "date": "2026-09-14",
        "notes": "피부손님 \nyy c 8-12 \n눈두덩이 지방 많음\n수원에서 받다가 오심",
        "price": 45000,
        "serviceName": "클래식연장"
      }
    ],
    "createdAt": "2026-09-11",
    "totalSpent": 45000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-14"
  },
  {
    "id": "cust-1788940265381",
    "memo": "",
    "name": "김진영",
    "grade": "단골",
    "phone": "010-9924-0451",
    "history": [
      {
        "id": "hist-1790870168767",
        "date": "2026-10-01",
        "notes": "yy d 8-13 쿠키 0.5 고",
        "price": 45000,
        "serviceName": "YY래쉬"
      },
      {
        "id": "hist-1788940273379",
        "date": "2026-09-09",
        "notes": "예약 시술 정상 완료",
        "price": 200000,
        "technique": "",
        "afterImage": "",
        "beforeImage": "",
        "serviceName": "여자 콤보눈썹 (결+섀도우) + 연장리터치",
        "pigmentColor": ""
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-09-09",
    "totalSpent": 245000,
    "totalVisits": 2,
    "isBlacklisted": false,
    "lastVisitDate": "2026-10-01"
  },
  {
    "id": "cust-1788759368929",
    "memo": "",
    "name": "김세아",
    "grade": "단골",
    "phone": "010-8528-6690",
    "history": [
      {
        "id": "hist-1788944944703",
        "date": "2026-09-09",
        "notes": "m2",
        "price": 35000,
        "serviceName": "노글루펌"
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-09-07",
    "totalSpent": 35000,
    "totalVisits": 1,
    "isBlacklisted": false,
    "lastVisitDate": "2026-09-09"
  },
  {
    "id": "cust-1788759282506",
    "memo": "",
    "name": "도예원",
    "grade": "단골",
    "phone": "010-9147-4449",
    "history": [
      {
        "id": "hist-1788759289939",
        "date": "2026-09-07",
        "notes": "저번보다 길게 유리D8-11 맘에 듬",
        "price": 45000,
        "serviceName": "클래식연장"
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-09-07",
    "totalSpent": 45000,
    "totalVisits": 1,
    "isBlacklisted": false,
    "lastVisitDate": "2026-09-07"
  },
  {
    "id": "cust-1788569356661",
    "memo": "짧고 풍성한테 자연스러운거 원함",
    "name": "윤면주",
    "grade": "주의",
    "phone": "010-2285-3587",
    "history": [
      {
        "id": "hist-1789121076209",
        "date": "2026-09-11",
        "notes": "예약 시술 정상 완료",
        "price": 45000,
        "serviceName": "클래식연장"
      },
      {
        "id": "hist-1788598714111",
        "date": "2026-09-05",
        "notes": "바비c 8mm 저번에 8-9였는데 길다함",
        "price": 55000,
        "technique": "",
        "afterImage": "",
        "afterImages": [],
        "beforeImage": "",
        "serviceName": "바비래쉬",
        "beforeImages": [],
        "pigmentColor": ""
      }
    ],
    "skinType": "",
    "allergies": "예약금 확인할 것",
    "createdAt": "2026-09-05",
    "totalSpent": 100000,
    "totalVisits": 2,
    "isBlacklisted": false,
    "lastVisitDate": "2026-09-11"
  },
  {
    "id": "cust-1788501048575",
    "memo": "",
    "name": "이예린",
    "grade": "단골",
    "phone": "010-9076-6337",
    "history": [
      {
        "id": "hist-1790038174722",
        "date": "2026-09-21",
        "notes": "플랫 C 0.20 10-15\n쿠키글루 0.5 고",
        "price": 30000,
        "technique": "",
        "afterImage": "",
        "beforeImage": "",
        "serviceName": "연장리터치",
        "pigmentColor": ""
      },
      {
        "id": "hist-1788590929577",
        "date": "2026-09-05",
        "notes": "플랫C 0.20 10-15mm",
        "price": 30000,
        "serviceName": "연장리터치"
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-09-04",
    "totalSpent": 60000,
    "totalVisits": 2,
    "isBlacklisted": false,
    "lastVisitDate": "2026-09-21"
  },
  {
    "id": "cust-1788433946084",
    "memo": "",
    "name": "임은유",
    "grade": "단골",
    "phone": "010-7942-2493",
    "history": [
      {
        "id": "hist-1788661217790",
        "date": "2026-09-06",
        "notes": "종가집 이라 화려하지 않게\n유리c 8-11 포인트연장",
        "price": 55000,
        "serviceName": "포인트연장"
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-09-03",
    "totalSpent": 55000,
    "totalVisits": 1,
    "isBlacklisted": false,
    "lastVisitDate": "2026-09-06"
  },
  {
    "id": "cust-1788360634688",
    "name": "최은재",
    "grade": "신규",
    "phone": "010-2050-2417",
    "history": [
      {
        "id": "hist-1789121457952",
        "date": "2026-09-11",
        "notes": "라니소개(온투유 손님) 결혼식 가신다함",
        "price": 35000,
        "serviceName": "노글루펌"
      }
    ],
    "createdAt": "2026-09-02",
    "totalSpent": 35000,
    "totalVisits": 1,
    "lastVisitDate": "2026-09-11"
  },
  {
    "id": "cust-1788338059911",
    "memo": "풍성 화려한 연장",
    "name": "김근영",
    "grade": "신규",
    "phone": "010-6254-9128",
    "history": [
      {
        "id": "hist-1789801839444",
        "date": "2026-09-18",
        "notes": "안과 치료로 왼쪽눈 치료 받으려고\n셀프 제거함\n눈썹이 많이 뜯기고 뽑힘 \nYY C 8-12",
        "price": 45000,
        "serviceName": "YY래쉬"
      },
      {
        "id": "hist-1788930917685",
        "date": "2026-09-06",
        "notes": "왼쪽 끝 빵구난곳",
        "price": 30000,
        "technique": "",
        "afterImage": "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870432343-8u2j0y6fk15.jpeg",
        "afterImages": [
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870432343-8u2j0y6fk15.jpeg"
        ],
        "beforeImage": "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870423238-8wqfq13i2oe.jpeg",
        "serviceName": "연장리터치",
        "beforeImages": [
          "https://vehvndduipgzjnksbdit.supabase.co/storage/v1/object/public/nunssup_photos/nunssup_me_7721/1790870423238-8wqfq13i2oe.jpeg"
        ],
        "pigmentColor": ""
      },
      {
        "id": "hist-1788338137480",
        "date": "2026-09-02",
        "notes": "안과 치료로 떨어져서 재연장",
        "price": 45000,
        "serviceName": "클래식연장"
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-09-02",
    "totalSpent": 120000,
    "totalVisits": 3,
    "lastVisitDate": "2026-09-18"
  },
  {
    "id": "cust-1788005130318",
    "name": "손예슬",
    "grade": "신규",
    "phone": "010-3797-7721",
    "history": [],
    "createdAt": "2026-08-29",
    "totalSpent": 0,
    "totalVisits": 0
  },
  {
    "id": "cust-1788004570177",
    "memo": "니모 XXL 맘에 들어 하심",
    "name": "박주리",
    "grade": "단골",
    "phone": "010-9304-9976",
    "history": [
      {
        "id": "hist-1788338135626",
        "date": "2026-09-02",
        "notes": "니모Xl",
        "price": 35000,
        "serviceName": "노글루펌"
      }
    ],
    "skinType": "",
    "allergies": "",
    "createdAt": "2026-08-29",
    "totalSpent": 35000,
    "totalVisits": 1,
    "isBlacklisted": false,
    "lastVisitDate": "2026-09-02"
  }
];

export const initialAppointments: Appointment[] = [
  {
    "id": "apt-1791358022036",
    "date": "2026-10-07",
    "time": "16:00",
    "notes": "이한울\n01029659004\n1007 16:00\n포인트펌\n 첫방문",
    "price": 55000,
    "status": "noshow",
    "createdAt": "2026-10-07",
    "serviceId": "srv-1789548240836",
    "updatedAt": "2026-10-07T07:27:13.611Z",
    "serviceName": "펌포인트",
    "customerName": "이한울",
    "isFirstVisit": true,
    "customerPhone": "010-2965-9004",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1791020805521",
    "date": "2026-10-04",
    "time": "18:00",
    "notes": "",
    "price": 45000,
    "status": "confirmed",
    "createdAt": "2026-10-03",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-10-03T09:46:47.521Z",
    "serviceName": "클래식연장",
    "customerName": "이나영",
    "isFirstVisit": true,
    "customerPhone": "010-8220-7393",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1791020732396",
    "date": "2026-10-03",
    "time": "16:30",
    "notes": "",
    "price": 45000,
    "status": "cancelled",
    "createdAt": "2026-10-03",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-10-03T09:45:53.460Z",
    "serviceName": "클래식연장",
    "customerName": "윤면주",
    "isFirstVisit": true,
    "customerPhone": "010-2285-3587",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1791011867445",
    "date": "2026-10-03",
    "time": "14:30",
    "notes": "라인이 검게 착색이 있음\n주황색 톤업 \n레드2:핑크5",
    "price": 250000,
    "status": "completed",
    "createdAt": "2026-10-03",
    "serviceId": "srv-5",
    "updatedAt": "2026-10-03T07:19:04.451Z",
    "serviceName": "생기 틴트 입술 (립 블러셔)",
    "customerName": "박승자",
    "isFirstVisit": true,
    "customerPhone": "010-3101-0363",
    "paymentMethod": "unpaid",
    "durationMinutes": 120
  },
  {
    "id": "apt-1790870243962",
    "date": "2026-10-08",
    "time": "17:00",
    "notes": "",
    "price": 45000,
    "status": "confirmed",
    "createdAt": "2026-10-02",
    "serviceId": "srv-1789548402865",
    "updatedAt": "2026-10-01T15:57:28.492Z",
    "serviceName": "YY래쉬",
    "customerName": "김근영",
    "isFirstVisit": true,
    "customerPhone": "010-6254-9128",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1790870216490",
    "date": "2026-10-03",
    "time": "18:00",
    "notes": "김진영님 소개\n\n▊성함 : 이나영\n▊연락처 : 01082207393\n▊날짜/시간 : 내일 6시\n▊연장/펌/눈썹 : 연장\n▊타샵연장제거O/X : O\n▊첫or재방문 : 첫방문\n▊요청사항 :9에서 10미리함께붙이고싶어여",
    "price": 45000,
    "status": "cancelled",
    "createdAt": "2026-10-02",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-10-03T09:44:52.731Z",
    "serviceName": "클래식연장",
    "customerName": "이나영",
    "isFirstVisit": true,
    "customerPhone": "010-8220-7393",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1790870161981",
    "date": "2026-10-01",
    "time": "14:30",
    "notes": "yy d 8-13 쿠키 0.5 고",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-10-02",
    "serviceId": "srv-1789548402865",
    "updatedAt": "2026-10-01T15:56:08.765Z",
    "serviceName": "YY래쉬",
    "customerName": "김진영",
    "isFirstVisit": true,
    "customerPhone": "010-9924-0451",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1790870086830",
    "date": "2026-09-30",
    "time": "04:30",
    "notes": "첫 방문\n타샵에서 계속 연장했었는데 모가 거칠고 불편해서 옮길 예정 / 불편해서 비볐다함 속눈썹 많이 빠지고 끊김\n완전 자연스럽게\n유리c 6-8",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-10-02",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-10-01T15:54:53.931Z",
    "serviceName": "클래식연장",
    "customerName": "박수정",
    "isFirstVisit": true,
    "customerPhone": "010-9430-5469",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1790038229559",
    "date": "2026-09-28",
    "time": "10:00",
    "notes": "yy D 8-10 s",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-22",
    "serviceId": "srv-1789548402865",
    "updatedAt": "2026-10-01T15:53:04.752Z",
    "serviceName": "YY래쉬",
    "customerName": "박나래",
    "isFirstVisit": true,
    "customerPhone": "010-5664-7883",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1789975933334",
    "date": "2026-09-21",
    "time": "17:00",
    "notes": "왼쪽 앞머리 빨리풀림\n모가 많이 짧음  M컬 s\n파랑이s 서브",
    "price": 35000,
    "status": "completed",
    "createdAt": "2026-09-21",
    "serviceId": "srv-1788004607592",
    "updatedAt": "2026-09-21T07:32:16.393Z",
    "serviceName": "노글루펌",
    "customerName": "김라연",
    "isFirstVisit": true,
    "customerPhone": "010-8003-0739",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1789801884479",
    "date": "2026-09-21",
    "time": "18:00",
    "notes": "플랫 C 0.20 10-15\n쿠키글루 0.5 고",
    "price": 30000,
    "status": "completed",
    "createdAt": "2026-09-19",
    "serviceId": "srv-1788501048574",
    "updatedAt": "2026-09-22T00:49:34.721Z",
    "serviceName": "연장리터치",
    "customerName": "이예린",
    "isFirstVisit": true,
    "customerPhone": "010-9076-6337",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1789801832398",
    "date": "2026-09-18",
    "time": "17:45",
    "notes": "안과 치료로 왼쪽눈 치료 받으려고\n셀프 제거함\n눈썹이 많이 뜯기고 뽑힘 \nYY C 8-12",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-19",
    "serviceId": "srv-1789548402865",
    "updatedAt": "2026-09-19T07:10:39.444Z",
    "serviceName": "YY래쉬",
    "customerName": "김근영",
    "isFirstVisit": true,
    "customerPhone": "010-6254-9128",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1789548402866",
    "date": "2026-09-20",
    "time": "10:00",
    "notes": "Y C 8-12",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-16",
    "serviceId": "srv-1789548402865",
    "updatedAt": "2026-09-20T02:42:07.378Z",
    "serviceName": "YY래쉬",
    "customerName": "신세희",
    "isFirstVisit": true,
    "customerPhone": "010-4072-0031",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1789548240837",
    "date": "2026-09-16",
    "time": "17:30",
    "notes": "펌포(55)연장 원함\n\n30분 늦춰서 30-50퍼로 연장해드림\n맘에 들어하심\nM컬 L 포인트 픽서 사용\n롱타임 투명 구매",
    "price": 90000,
    "status": "completed",
    "createdAt": "2026-09-16",
    "serviceId": "custom",
    "updatedAt": "2026-09-16T08:44:03.087Z",
    "serviceName": "펌포인트 + 롱타임투명",
    "customerName": "김보령",
    "isFirstVisit": true,
    "customerPhone": "010-5579-7827",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1789224113181",
    "date": "2026-09-13",
    "time": "18:00",
    "notes": "김진영님 소개\n\n▊성함 : 이나영\n▊연락처 : 01082207393\n▊날짜/시간 : 내일 6시\n▊연장/펌/눈썹 : 연장\n▊타샵연장제거O/X : O\n▊첫or재방문 : 첫방문\n\n플랫c 0.20 9-10\n\n▊요청사항 :9에서 10미리함께붙이고싶어여",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-12",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-09-12T14:41:59.184Z",
    "serviceName": "클래식연장",
    "customerName": "이나영",
    "isFirstVisit": true,
    "customerPhone": "010-8220-7393",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1789099896049",
    "date": "2026-09-14",
    "time": "12:00",
    "notes": "피부손님 \nyy c 12 13\n눈두덩이 지방 많음\n수원에서 받다가 오심\n📍눈썹짧고 약함 앞머리 짧은거 하면 염증때문에\n12로 하기\n",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-11",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-09-11T04:11:46.023Z",
    "serviceName": "클래식연장",
    "customerName": "김현영",
    "isFirstVisit": true,
    "customerPhone": "010-6682-0806",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788945048727",
    "date": "2026-09-11",
    "time": "19:30",
    "notes": "바비D 8mm 맘에 들어하심",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-09",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-09-09T09:10:51.492Z",
    "serviceName": "클래식연장",
    "customerName": "윤면주",
    "isFirstVisit": true,
    "customerPhone": "010-2285-3587",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1788940265381",
    "date": "2026-09-09",
    "time": "14:30",
    "notes": "비타콩 5리얼브라운 1816u\n잔흔 중화 후 콤보\n\n/Y D 9-13",
    "price": 200000,
    "status": "completed",
    "createdAt": "2026-09-09",
    "serviceId": "custom",
    "updatedAt": "2026-09-09T07:51:13.378Z",
    "serviceName": "여자 콤보눈썹 (결+섀도우) + 연장리터치",
    "customerName": "김진영",
    "isFirstVisit": true,
    "customerPhone": "010-9924-0451",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788759368929",
    "date": "2026-09-09",
    "time": "17:00",
    "notes": "m+ 맘에 들어함 롱타임투명 선물함",
    "price": 35000,
    "status": "completed",
    "createdAt": "2026-09-07",
    "serviceId": "srv-1788004607592",
    "updatedAt": "2026-09-07T05:36:10.759Z",
    "serviceName": "노글루펌",
    "customerName": "김세아",
    "isFirstVisit": true,
    "customerPhone": "010-8528-6690",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788759282506",
    "date": "2026-09-07",
    "time": "11:00",
    "notes": "저번보다 길게 유리D8-11 맘에 듬",
    "price": 45000,
    "status": "completed",
    "createdAt": "2026-09-07",
    "serviceId": "srv-1788004635526",
    "updatedAt": "2026-09-07T05:34:49.938Z",
    "serviceName": "클래식연장",
    "customerName": "도예원",
    "isFirstVisit": true,
    "customerPhone": "010-9147-4449",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1788569399998",
    "date": "2026-09-05",
    "time": "18:00",
    "notes": "바비c 8mm 저번에 8-9였는데 길다함",
    "price": 55000,
    "status": "cancelled",
    "createdAt": "2026-09-05",
    "serviceId": "custom-1788569399998",
    "updatedAt": "2026-09-05T09:03:48.713Z",
    "serviceName": "바비래쉬",
    "customerName": "윤면주",
    "isFirstVisit": true,
    "customerPhone": "010-2285-3587",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788569243635",
    "date": "2026-09-06",
    "time": "13:00",
    "notes": "왼쪽 끝 빵구난곳",
    "price": 30000,
    "status": "completed",
    "createdAt": "2026-09-05",
    "serviceId": "srv-1788501048574",
    "updatedAt": "2026-09-09T05:15:17.685Z",
    "serviceName": "연장리터치",
    "customerName": "김근영",
    "isFirstVisit": true,
    "customerPhone": "010-6254-9128",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788501048575",
    "date": "2026-09-05",
    "time": "14:30",
    "notes": "플랫C 0.20 10-15mm",
    "price": 30000,
    "status": "completed",
    "createdAt": "2026-09-04",
    "serviceId": "custom-1788501048575",
    "updatedAt": "2026-09-05T09:03:32.352Z",
    "serviceName": "연장리터치",
    "customerName": "이예린",
    "isFirstVisit": true,
    "customerPhone": "010-9076-6337",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788439387562",
    "date": "2026-09-06",
    "time": "10:00",
    "notes": "종가집 이라 화려하지 않게\n유리c 8-11 포인트연장",
    "price": 55000,
    "status": "completed",
    "createdAt": "2026-09-03",
    "serviceId": "srv-1788433977218",
    "updatedAt": "2026-09-06T02:20:17.789Z",
    "serviceName": "포인트연장",
    "customerName": "임은유",
    "isFirstVisit": true,
    "customerPhone": "010-7942-2493",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1788360634688",
    "date": "2026-09-11",
    "time": "18:00",
    "notes": "라니소개(온투유 손님) 결혼식 가신다함\n빠짝인데 점막 안들리게 해달라 하심\nM컬 L 다음엔 한 단계 작은롯드로 해도 될 듯\n다음에 방문하시면 컬 어땠는지 물어보기",
    "price": 35000,
    "status": "completed",
    "createdAt": "2026-09-02",
    "serviceId": "srv-1788004607592",
    "updatedAt": "2026-09-02T14:50:41.801Z",
    "serviceName": "노글루펌",
    "customerName": "최은재",
    "isFirstVisit": true,
    "customerPhone": "010-2050-2417",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1788338123468",
    "date": "2026-09-02",
    "time": "16:00",
    "notes": "안과 치료로 떨어져서 재연장",
    "price": 45000,
    "status": "completed",
    "smsSent": true,
    "createdAt": "2026-09-02",
    "serviceId": "srv-1788004635526",
    "smsSentAt": "2026-09-02T08:35:32.249Z",
    "updatedAt": "2026-09-02T08:35:37.480Z",
    "serviceName": "클래식연장",
    "customerName": "김근영",
    "isFirstVisit": true,
    "customerPhone": "010-6254-9128",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  },
  {
    "id": "apt-1788004802948",
    "date": "2026-09-02",
    "time": "15:00",
    "notes": "니모XXL",
    "price": 35000,
    "status": "completed",
    "createdAt": "2026-08-29",
    "serviceId": "srv-1788004607592",
    "updatedAt": "2026-09-03T14:29:10.478Z",
    "serviceName": "노글루펌",
    "customerName": "박주리",
    "isFirstVisit": true,
    "customerPhone": "010-9304-9976",
    "paymentMethod": "unpaid",
    "durationMinutes": 60
  },
  {
    "id": "apt-1787991943478",
    "date": "2026-09-02",
    "time": "15:00",
    "notes": "",
    "price": 160000,
    "status": "cancelled",
    "createdAt": "2026-08-29",
    "serviceId": "srv-3",
    "updatedAt": "2026-08-29T08:36:40.288Z",
    "serviceName": "남자 맞춤 결눈썹",
    "customerName": "테스트",
    "isFirstVisit": true,
    "customerPhone": "000-000-0000",
    "paymentMethod": "unpaid",
    "durationMinutes": 90
  }
];

export const initialTimeBlocks: TimeBlock[] = [];

export const sampleCustomers: Customer[] = initialCustomers;
export const sampleAppointments: Appointment[] = initialAppointments;
export const sampleTimeBlocks: TimeBlock[] = initialTimeBlocks;
