export const inputContent = {
  loginId: {
    title: '아이디',
    message: {
      regexError: '영문 또는 숫자로 조합된 4~20자의 아이디를 입력해주세요.',
      success: '사용 가능한 아이디입니다.',
      fail: '이미 존재하는 아이디입니다.',
    },
  },
  findLoginId: {
    title: '아이디',
    message: {
      regexError: '아이디를 입력해주세요.',
    },
  },
  phone: {
    title: '휴대폰 번호',
    message: {
      regexError: '휴대폰 번호를 - 구분 없이 입력해주세요.',
      success: '인증번호를 전송하였습니다.',
    },
  },
  code: {
    title: '인증번호',
    message: {
      success: '인증되었습니다.',
      fail: '인증번호가 유효하지 않습니다.',
    },
  },
  nickname: {
    title: '닉네임',
    message: {
      regexError: '한글, 영어, 숫자만 입력 가능합니다.',
      fail: '닉네임 재변경은 1주일 후 가능합니다.',
    },
  },
  password: {
    title: '비밀번호',
    message: {
      regexError: '영문,숫자,특수문자 조합의 8~16자의 비밀번호를 입력해주세요.',
    },
  },
  passwordCheck: {
    title: '비밀번호 확인',
    message: {
      regexError: '비밀번호가 일치하지 않습니다.',
    },
  },
}
