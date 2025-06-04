"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import { ChevronRight } from "lucide-react";

interface TermsAgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: TermsType;
}

export type TermsType =
    | "personalInfo"
    | "uniqueIdInfo"
    | "telecomTerms"
    | "serviceTerms"
    | "thirdPartyInfo";

export function TermsAgreementModal({
    isOpen,
    onClose,
    type,
}: TermsAgreementModalProps) {
    const termsContent = getTermsContent(type);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={termsContent.title}>
            <div className="text-sm max-h-[70vh] overflow-y-auto">
                {termsContent.content.map((section, index) => (
                    <div key={index} className="mb-6">
                        <h3 className="font-bold mb-2">{section.title}</h3>
                        <p className="text-gray-700 whitespace-pre-line">{section.text}</p>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

function getTermsContent(type: TermsType) {
    switch (type) {
        case "personalInfo":
            return {
                title: "개인정보 수집/이용 동의",
                content: [
                    {
                        title: "회사 소개",
                        text: "2025년 5월 20일에 설립된 CREPE(이하 \"CREPE\", \"당사\", \"당사를\" 또는 \"당사의\") Organization (KRS:번호 02-759-4114, 등록 주소: 서울특별시 마포구 상암동 마포구 월드컵북로 434 상암 IT Tower 6floor) 귀하의 개인정보를 보호하고 존중할 것을 약속합니다.",
                    },
                    {
                        title: "수집하는 개인정보 항목",
                        text: "당사가 수집하는 개인정보 유형에는 다음이 포함될 수 있습니다.\n\n- 귀하의 이름\n- 귀하의 사진이 있는 신분증 및 서류\n- 귀하의 생체 정보\n- 귀하의 주소\n- 귀하의 전화번호\n- 귀하의 이메일 주소\n- 귀하의 사용자 이름\n- 귀하의 IP 주소(들) 및 위치 정보\n- 귀하의 장치 및 브라우저 정보\n- 계좌 번호를 포함한 귀하의 은행 계좌 세부 정보\n- 귀하의 생년월일\n- 귀하의 거래",
                    },
                    {
                        title: "개인정보의 수집 및 이용목적",
                        text: "당사는 귀하의 개인정보를 다음과 같은 목적으로 사용할 수 있습니다.\n\n- rolling-crepe.com에서 계정을 개설하고 운영할 수 있도록 허용\n- rolling-crepe.com에서 거래를 완료할 수 있도록 지원\n- 귀하가 당사에 연락하는 경우, 귀하의 질문에 회신\n- 사이트 사용 방법 분석\n- 규제 목적으로 요구되는 경우\n- 당사와 제3자가 제공하는 귀하가 관심을 가질 만한 제품과 프로모션에 관한 정보 제공\n- 시장 조사(예: 고객들의 요구 사항, 당사의 성과와 같은 이슈에 관한 의견을 조사)",
                    },
                    {
                        title: "개인정보의 보유 및 이용기간",
                        text: "당사는 본 개인정보 보호정책에 기술되어 있는 목적과 법적, 규제적 요건을 고려하면서 필요한 경우에 한하여 귀하의 개인정보를 보유합니다. 당사는 기록 보관 의무에 따라, 회원이 탈퇴한 후 최소 5년간 관련 정보를 유지합니다.",
                    },
                ],
            };
        case "uniqueIdInfo":
            return {
                title: "고유식별정보 처리 동의",
                content: [
                    {
                        title: "생체정보 수집 및 이용목적",
                        text: "당사는 계정 인증 절차의 일환으로 신분증의 실제 소유자를 확인하기 위해, 제공된 얼굴 이미지와 신분증에 부착된 얼굴 이미지를 비교하여 생체 정보를 수집합니다.",
                    },
                    {
                        title: "생체정보 처리 및 보호",
                        text: "당사는 생체 정보를 수집된 목적으로만 사용하며, 추가 서면 동의 없이는 이를 다른 목적으로 사용하지 않습니다.\n\n당사는 법률 또는 개인의 서면 동의가 없는 한 생체 정보를 제3자에게 공개하지 않습니다. 당사를 대신하여 생체 정보에 접근할 수 있는 제3자 (타사) 공급업체는 계약상 본 정책을 준수해야 합니다.",
                    },
                    {
                        title: "제3자 공급업체 관리",
                        text: "당사를 대신하여 생체 정보에 접근할 수 있는 제3자 공급업체는 계약상 본 정책을 준수해야 합니다. 제3자 공급업체는 계약상 본 정책을 준수해야 합니다.",
                    },
                ],
            };
        case "telecomTerms":
            return {
                title: "통신사 이용약관 동의",
                content: [
                    {
                        title: "시스템 정보 수집",
                        text: "당사는 시스템 관리를 위해, 그리고 당사의 광고주들에게 집계 정보를 보고하기 위해, 귀하의 컴퓨터에 관한 정보(가능한 경우 귀하의 IP 주소, 운영체제, 브라우저 유형 등)를 수집할 수 있습니다. 이 정보는 사용자의 탐색 작업 및 패턴에 대한 통계 데이터로, 개인을 식별하지 않습니다.",
                    },
                    {
                        title: "VPN/Proxy 사용 제한",
                        text: "참고 : CREPE 서비스를 사용하는 동안 위치를 숨길 수 있는 Proxy / VPN 또는 기타 소프트웨어를 사용하는 것은 금지되어 있습니다.",
                    },
                    {
                        title: "쿠키 사용",
                        text: "당사는 \"쿠키\"라고 알려진 브라우저 기능을 사용하여 컴퓨터에 고유한 ID를 할당합니다. 쿠키는 일반적으로 컴퓨터의 하드 드라이브에 저장됩니다. 쿠키로부터 수집된 정보는 본 사이트의 유효성 평가, 트렌드 분석, 및 사이트 작동 보장에 사용됩니다.",
                    },
                    {
                        title: "제3자 서비스 공급자",
                        text: "당사는 당사 사이트의 사용 상황을 더욱 잘 이해하기 위해 제3자 서비스 공급자를 활용합니다. 당사의 서비스 공급자는 귀하의 컴퓨터 하드 드라이브에 쿠키를 설치하고, 당사가 분석을 위해 선택한 정보를 수신합니다. 서비스 공급자는 계약에 따라 당사의 사이트에서 수신하는 정보를 사용할 수 없습니다.",
                    },
                ],
            };
        case "serviceTerms":
            return {
                title: "서비스 이용약관 동의",
                content: [
                    {
                        title: "데이터 보호 책임자",
                        text: "귀하의 개인정보를 보호할 책임은 당사의 데이터 보호 책임자(Data Protection Officer, DPO)에게 있습니다. 귀하는 개인정보 관련 질문이 있는 경우 이 책임자에게 연락하실 수 있습니다. DPO에게 연락하시려면 fivesidedish@gmail.com으로 문의하시기 바랍니다.",
                    },
                    {
                        title: "제3자 사이트 링크",
                        text: "당사의 사이트에는 다른 사이트, 제3자가 제공하는 자료에 대한 링크가 있을 수 있습니다. 본 개인정보 보호정책은 당사의 사이트에만 적용됩니다. 당사는 제3자 사이트 또는 해당 사이트에 포함된 내용을 통제하지 않습니다.",
                    },
                    {
                        title: "정책 변경",
                        text: "당사의 사이트 정책, 컨텐츠, 정보, 프로모션, 공개, 면책 조항 및 기능은 CREPE의 전적인 재량에 따라 사전 예고 없이 언제든 수정, 개정, 업데이트 및/또는 보완될 수 있습니다. 동 개인정보 보호정책이 변경되는 경우, 당사는 사이트 공지를 통해 모든 사용자에게 이를 알리고, 개정된 개인정보 보호정책을 사이트에 게시할 것입니다.",
                    },
                    {
                        title: "연락처",
                        text: "당사의 개인정보 보호정책 및/또는 rolling-crepe.com과 관련된 관행에 관하여 질문, 의견 또는 우려 사항이 있는 경우, fivesidedish@gmail.com으로 연락해주십시오.",
                    },
                ],
            };
        case "thirdPartyInfo":
            return {
                title: "개인정보 제3자 제공 동의",
                content: [
                    {
                        title: "개인정보 제공 대상",
                        text: "당사는 이와 같이 제한적인 목적을 위해, 귀하가 당사에 제공하는 개인정보를 당사의 계열사, 대리인, 대표, 신뢰할 수 있는 서비스 공급자 및 도급업자에게 제공할 수 있습니다.\n\n특히 법률에 의해 필요하고 허용되는 경우, 당사는 다음 당사자와 귀하에 관한 정보를 공유할 수 있습니다:\n- 제3자 검증 서비스 공급자(즉, 신원 및 주소 관련 검증 서비스 공급자)\n- 카드 발행 은행\n- 결제 처리 파트너\n- 당사 파트너사 및 서비스 제공자\n- 분쟁 또는 입금 취소의 경우 은행 또는 기타 금융기관\n- 요청이 있을 시 정부와 규제 담당 공무원",
                    },
                    {
                        title: "제공되는 개인정보 항목",
                        text: "당사는 귀하로부터 개인정보를 수집할 때 명시했던 목적을 위해, 그리고/또는 본 개인정보 보호정책에 명시된 목적을 위해, 그리고/또는 법이 허용하는 바와 같이 개인정보를 사용합니다.",
                    },
                    {
                        title: "국제적 정보 처리",
                        text: "당사는 다양한 국가에 소재한 파트너들과 협력하고 있으므로, 귀하의 정보가 다른 관할 구역에서 처리 및 보관될 수도 있습니다. 단, 해당 관할 구역에서 법으로 허용하는 경우에 한합니다.\n\n당사는 안전한 데이터 전송 채널, 계약상의 의무 및 기타 수단을 사용하여 언제든 개인정보의 안전을 보장하기 위해 노력합니다.",
                    },
                    {
                        title: "개인정보 권리",
                        text: "귀하는 귀하의 개인정보에 액세스할 권리가 있으며 fivesidedish@gmail.com으로 이메일을 보내 정확하지 않거나 잘못된 데이터의 수정, 업데이트 및 차단을 요구할 권리가 있습니다. 또한, 귀하는 fivesidedish@gmail.com으로 이메일을 보내 계정과 개인정보의 삭제 또는 파기를 요청할 수 있습니다.",
                    },
                ],
            };
        default:
            return {
                title: "약관 내용",
                content: [
                    {
                        title: "약관 내용이 없습니다.",
                        text: "선택한 약관에 대한 내용이 준비되지 않았습니다.",
                    },
                ],
            };
    }
}