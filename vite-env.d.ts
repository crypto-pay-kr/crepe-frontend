interface ImportMetaEnv {
    readonly VITE_API_SERVER_URL: string; // 환경 변수 타입 정의
    readonly VITE_SKIP_PHONE_VERIFICATION?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
