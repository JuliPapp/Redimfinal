import svgPaths from "./svg-2nhxywnq9y";

function Heading1() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[166.051px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[23.999px] relative w-[166.051px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] top-[-0.73px] tracking-[-0.3125px] w-[167px]">Buenas noches, Julidel</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[rgba(126,179,213,0.1)] h-[21.811px] relative rounded-[10px] shrink-0 w-[47.138px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.811px] items-center justify-center overflow-clip px-[8.909px] py-[2.909px] relative rounded-[inherit] w-[47.138px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#7eb3d5] text-[12px] text-nowrap whitespace-pre">Líder</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[652.912px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[23.999px] items-center relative w-[652.912px]">
        <Heading1 />
        <Badge />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12.9px] size-[15.994px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2159)" id="Icon">
          <path d="M7.99716 4.66501V13.995" id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.pd5f2f00} id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2159">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#fdfcfb] h-[35.994px] relative rounded-[10px] shrink-0 w-[123.111px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[35.994px] relative w-[123.111px]">
        <Icon />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[44.89px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[8.37px] tracking-[-0.1504px] whitespace-pre">Biblioteca</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p39ce7400} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[35.994px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[35.994px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a68dbc0} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d="M13.995 7.99716H5.99787" id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p1f15eec0} id="Vector_3" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[35.994px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[35.994px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[35.994px] relative shrink-0 w-[211.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7.997px] h-[35.994px] items-start relative w-[211.094px]">
        <Button />
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[35.994px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[#fdfcfe] box-border content-stretch flex flex-col h-[84.901px] items-start left-[-33px] pb-[0.909px] pt-[23.999px] px-[135.724px] top-0 w-[1135.45px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0px_0px_0.909px] border-solid inset-0 pointer-events-none" />
      <Container2 />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[16.001px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[-0.01px] not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.37px] tracking-[-0.3125px] whitespace-pre">Mis discípulos</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-[-0.01px] not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Personas que estás acompañando en su proceso de restauración</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[40px] relative shrink-0 w-[471.889px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[40px] items-start relative w-[471.889px]">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#fdfcfb] h-[31.996px] relative rounded-[10px] shrink-0 w-[91.825px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[31.996px] items-center justify-center px-[12.909px] py-[0.909px] relative w-[91.825px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#2d3748] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Actualizar</p>
      </div>
    </div>
  );
}

function LeaderDashboard() {
  return (
    <div className="h-[40px] relative shrink-0 w-[814.19px]" data-name="LeaderDashboard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-between relative w-[814.19px]">
        <Container4 />
        <Button3 />
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute box-border content-stretch flex gap-[6px] h-[28.999px] items-center justify-center left-[1.62px] px-[8.909px] py-[4.909px] rounded-[16px] top-[2.98px] w-[214.503px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#2d3748] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Confirmados (2)</p>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute box-border content-stretch flex gap-[6px] h-[28.999px] items-center justify-center left-[216.12px] px-[8.909px] py-[4.909px] rounded-[16px] top-[2.98px] w-[214.503px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#2d3748] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Pendientes (1)</p>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[6px] h-[28.999px] items-center justify-center left-[430.63px] px-[8px] py-[4px] rounded-[16px] top-[2.98px] w-[214.503px]" data-name="Primitive.button">
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#2d3748] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Disponibles (0)</p>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#e8f5f1] h-[36px] relative rounded-[16px] shrink-0 w-[649px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[649px]">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Felix</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">fbritez04@gmail.com</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-[0.2px] not-italic text-[#5a6c6d] text-[16px] top-[-0.79px] tracking-[-0.3125px] w-[231px]">Desde 14 de octubre de 2025</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.999px] h-[79.993px] items-start left-[16.9px] top-[16.9px] w-[504.19px]" data-name="Container">
      <Container5 />
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[10.91px] size-[15.994px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2155)" id="Icon">
          <path d={svgPaths.p2eb0bf00} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p1f301500} id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2155">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#fdfcfb] h-[31.996px] relative rounded-[10px] shrink-0 w-[142.33px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[31.996px] relative w-[142.33px]">
        <Icon3 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[40.9px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[6.37px] tracking-[-0.1504px] whitespace-pre">Ver check-ins</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[10.91px] size-[15.994px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2150)" id="Icon">
          <path d={svgPaths.p15935c00} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p23a34100} id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d="M14.6615 7.33073H10.6629" id="Vector_3" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2150">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#fdfcfb] h-[31.996px] relative rounded-[10px] shrink-0 w-[125.866px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[31.996px] relative w-[125.866px]">
        <Icon4 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[40.9px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[6.37px] tracking-[-0.1504px] whitespace-pre">Desasignar</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[7.997px] h-[31.996px] items-start left-[521.09px] top-[40.9px] w-[276.193px]" data-name="Container">
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[113.8px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">discipulo_sin_lider</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">falsod@gmail.com</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-[0.2px] not-italic text-[#5a6c6d] text-[16px] top-[-0.58px] tracking-[-0.3125px] w-[231px]">Desde 12 de octubre de 2025</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.999px] h-[79.993px] items-start left-[16.9px] top-[16.9px] w-[504.19px]" data-name="Container">
      <Container9 />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[10.91px] size-[15.994px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2155)" id="Icon">
          <path d={svgPaths.p2eb0bf00} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p1f301500} id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2155">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#fdfcfb] h-[31.996px] relative rounded-[10px] shrink-0 w-[142.33px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[31.996px] relative w-[142.33px]">
        <Icon5 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[40.9px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[6.37px] tracking-[-0.1504px] whitespace-pre">Ver check-ins</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[10.91px] size-[15.994px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2150)" id="Icon">
          <path d={svgPaths.p15935c00} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p23a34100} id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d="M14.6615 7.33073H10.6629" id="Vector_3" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2150">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#fdfcfb] h-[31.996px] relative rounded-[10px] shrink-0 w-[125.866px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[31.996px] relative w-[125.866px]">
        <Icon6 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[40.9px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[6.37px] tracking-[-0.1504px] whitespace-pre">Desasignar</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[7.997px] h-[31.996px] items-start left-[521.09px] top-[40.9px] w-[276.193px]" data-name="Container">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[113.8px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container10 />
      <Container11 />
    </div>
  );
}

function LeaderDashboard1() {
  return (
    <div className="h-[239.595px] relative shrink-0 w-[814.19px]" data-name="LeaderDashboard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[11.996px] h-[239.595px] items-start relative w-[814.19px]">
        <Container8 />
        <Container12 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#fdfcfe] h-[425px] relative rounded-[16px] shrink-0 w-[864px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[29.993px] h-[425px] items-start pb-[0.909px] pl-[24.908px] pr-[0.909px] pt-[24.908px] relative w-[864px]">
        <LeaderDashboard />
        <TabList />
        <LeaderDashboard1 />
      </div>
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="absolute h-[16.001px] left-[23.72px] top-[23.89px] w-[814.19px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.36px] tracking-[-0.3125px] whitespace-pre">Mis Horarios Disponibles</p>
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="absolute h-[23.999px] left-[23.72px] top-[45.89px] w-[814.19px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Configura tus horarios para que tus discípulos puedan agendar reuniones contigo</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[69.993px] relative shrink-0 w-[862.187px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[69.993px] relative w-[862.187px]">
        <CardTitle1 />
        <CardDescription1 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2142)" id="Icon">
          <path d={svgPaths.pc8bf600} id="Vector" stroke="var(--stroke-0, #7EB3D5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p1c2ab400} id="Vector_2" stroke="var(--stroke-0, #7EB3D5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2142">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[rgba(126,179,213,0.1)] relative rounded-[1.5252e+07px] shrink-0 size-[31.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center pl-0 pr-[0.007px] py-0 relative size-[31.996px]">
        <Icon7 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[143.402px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[143.402px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-[-0.28px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[0.26px] tracking-[-0.1504px] whitespace-pre">Agregar nuevo horario</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[31.996px] items-center relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Heading4 />
    </div>
  );
}

function Label() {
  return (
    <div className="absolute box-border content-stretch flex h-[14.546px] items-start left-0 pl-[4px] pr-0 py-0 top-[5.91px] w-[100.135px]" data-name="Label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#5a6c6d] text-[12px] text-nowrap whitespace-pre">Día de la semana</p>
    </div>
  );
}

function Option() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Seleccionar día</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Lunes</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Martes</p>
    </div>
  );
}

function Option3() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Miércoles</p>
    </div>
  );
}

function Option4() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Jueves</p>
    </div>
  );
}

function Option5() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Viernes</p>
    </div>
  );
}

function Option6() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Sábado</p>
    </div>
  );
}

function Option7() {
  return (
    <div className="absolute left-[-177.54px] size-0 top-[-360.68px]" data-name="Option">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-0 not-italic text-[#2d3748] text-[16px] top-0 tracking-[-0.3125px] w-0">Domingo</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-[#fdfcfb] h-[42.273px] left-0 rounded-[12px] top-[24px] w-[186.094px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
      <Option6 />
      <Option7 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[69.815px] left-[-0.28px] top-[-0.1px] w-[186.094px]" data-name="Container">
      <Label />
      <Dropdown />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute box-border content-stretch flex h-[14.546px] items-start left-0 pl-[4px] pr-0 py-0 top-[5.91px] w-[81.868px]" data-name="Label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#5a6c6d] text-[12px] text-nowrap whitespace-pre">Hora de inicio</p>
    </div>
  );
}

function TimePicker() {
  return (
    <div className="absolute bg-[#fdfcfb] h-[45.817px] left-0 rounded-[12px] top-[24px] w-[186.101px]" data-name="Time Picker">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[69.815px] left-[197.81px] top-[-0.1px] w-[186.101px]" data-name="Container">
      <Label1 />
      <TimePicker />
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute box-border content-stretch flex h-[14.546px] items-start left-0 pl-[4px] pr-0 py-0 top-[5.91px] w-[66.477px]" data-name="Label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#5a6c6d] text-[12px] text-nowrap whitespace-pre">Hora de fin</p>
    </div>
  );
}

function TimePicker1() {
  return (
    <div className="absolute bg-[#fdfcfb] h-[45.817px] left-0 rounded-[12px] top-[24px] w-[186.101px]" data-name="Time Picker">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[69.815px] left-[395.91px] top-[-0.1px] w-[186.101px]" data-name="Container">
      <Label2 />
      <TimePicker1 />
    </div>
  );
}

function Label3() {
  return (
    <div className="absolute box-border content-stretch flex h-[14.546px] items-start left-0 pl-[4px] pr-0 py-0 top-[5.91px] w-[42.223px]" data-name="Label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0)] text-nowrap whitespace-pre">Acción</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[50.72px] size-[15.994px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2172)" id="Icon">
          <path d={svgPaths.p2e209400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p19a80c80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2172">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[#7eb3d5] h-[35.994px] left-0 rounded-[10px] top-[24px] w-[186.101px]" data-name="Button">
      <Icon8 />
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[82.71px] not-italic text-[14px] text-nowrap text-white top-[8.36px] tracking-[-0.1504px] whitespace-pre">Agregar</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[69.815px] left-[594.01px] top-[-0.1px] w-[186.101px]" data-name="Container">
      <Label3 />
      <Button8 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[69.815px] relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container16 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function MeetingScheduler() {
  return (
    <div className="h-[143.615px] relative rounded-[12px] shrink-0 w-full" data-name="MeetingScheduler">
      <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(126,179,213,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[7.997px] h-[143.615px] items-start pb-[0.909px] pt-[16.903px] px-[16.903px] relative w-full">
          <Container14 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[16.63px] size-[15.994px] top-[14.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2105_2146)" id="Icon">
          <path d={svgPaths.p1ffb2e00} id="Vector" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
          <path d={svgPaths.p2e209400} id="Vector_2" stroke="var(--stroke-0, #2D3748)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2146">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MeetingScheduler1() {
  return (
    <div className="absolute h-[26.001px] left-0 top-0 w-[231.712px]" data-name="MeetingScheduler">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[26px] left-0 not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.36px] tracking-[-0.3125px] whitespace-pre">No tienes horarios configurados</p>
    </div>
  );
}

function MeetingScheduler2() {
  return (
    <div className="absolute h-[26.001px] left-0 top-[34px] w-[634.375px]" data-name="MeetingScheduler">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[26px] left-0 not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.36px] tracking-[-0.3125px] whitespace-pre">Agrega horarios disponibles para que tus discípulos puedan agendar reuniones contigo.</p>
    </div>
  );
}

function AlertDescription() {
  return (
    <div className="absolute h-[60px] left-[52.62px] top-[12.8px] w-[744.396px]" data-name="AlertDescription">
      <MeetingScheduler1 />
      <MeetingScheduler2 />
    </div>
  );
}

function Alert() {
  return (
    <div className="bg-[#fdfcfe] h-[85.81px] relative rounded-[12px] shrink-0 w-full" data-name="Alert">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon9 />
      <AlertDescription />
    </div>
  );
}

function CardContent() {
  return (
    <div className="h-[277.422px] relative shrink-0 w-[862.187px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[23.999px] h-[277.422px] items-start px-[23.999px] py-0 relative w-[862.187px]">
        <MeetingScheduler />
        <Alert />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-[#fdfcfe] box-border content-stretch flex flex-col gap-[23.999px] h-[373.232px] items-start p-[0.909px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <CardHeader />
      <CardContent />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1e2ba06f} id="Vector" stroke="var(--stroke-0, #7EB3D5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pef5c30} id="Vector_2" stroke="var(--stroke-0, #7EB3D5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[rgba(126,179,213,0.1)] relative rounded-[12px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon10 />
      </div>
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="h-[16.001px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[-0.28px] not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.47px] tracking-[-0.3125px] whitespace-pre">Reuniones con Discípulos</p>
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-[-0.28px] not-italic text-[#5a6c6d] text-[16px] text-nowrap top-[-0.83px] tracking-[-0.3125px] whitespace-pre">Gestiona las reuniones con tus discípulos</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[40px] relative shrink-0 w-[298.942px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4.578e_-5px] h-[40px] items-start relative w-[298.942px]">
        <CardTitle2 />
        <CardDescription2 />
      </div>
    </div>
  );
}

function MeetingScheduler3() {
  return (
    <div className="h-[40px] relative shrink-0 w-[814.19px]" data-name="MeetingScheduler">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[40px] items-center relative w-[814.19px]">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-[#99a1af] h-[31.996px] relative rounded-[1.5252e+07px] shrink-0 w-[7.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[31.996px] w-[7.997px]" />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-[-0.28px] not-italic text-[#2d3748] text-[14px] text-nowrap top-[0.26px] tracking-[-0.1504px] whitespace-pre">Reuniones Canceladas</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16.001px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-[-0.28px] not-italic text-[#5a6c6d] text-[12px] top-[0.35px] w-[75px]">5 canceladas</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[35.994px] relative shrink-0 w-[146.101px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[2.289e_-5px] h-[35.994px] items-start relative w-[146.101px]">
        <Heading5 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[35.994px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[7.997px] h-[35.994px] items-center pl-[3.999px] pr-0 py-0 relative w-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_2137)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 7.5L7.5 12.5" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 7.5L12.5 12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2137">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-gray-100 relative rounded-[12px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon11 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">juli</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2127)" id="Icon">
          <path d="M4.66619 1.16655V3.49964" id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M9.33239 1.16655V3.49964" id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p3c05b400} id="Vector_3" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M1.74982 5.83274H12.2488" id="Vector_4" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2127">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[51.378px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[51.378px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">monday</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon12 />
      <Paragraph5 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2163)" id="Icon">
          <path d={svgPaths.p1fb1e8c0} id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p1839c080} id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2163">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[88.324px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[88.324px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">20:00 - 21:00</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon13 />
      <Paragraph6 />
    </div>
  );
}

function Container29() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[3.999px] h-[71.981px] items-start relative w-full">
        <Container26 />
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[71.981px] items-start relative w-full">
        <Container25 />
        <Container29 />
      </div>
    </div>
  );
}

function MeetingCard() {
  return <div className="absolute bg-[#6a7282] left-[8.91px] rounded-[1.5252e+07px] size-[5.994px] top-[7.91px]" data-name="MeetingCard" />;
}

function Badge1() {
  return (
    <div className="bg-gray-100 h-[21.811px] relative rounded-[10px] shrink-0 w-[94.51px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21.811px] overflow-clip relative rounded-[inherit] w-[94.51px]">
        <MeetingCard />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[24.89px] not-italic text-[#364153] text-[12px] text-nowrap top-[3.36px] whitespace-pre">Cancelada</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.909px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex h-[71.981px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Badge1 />
    </div>
  );
}

function MeetingCard1() {
  return (
    <div className="absolute bg-[#fdfcfe] h-[117.784px] left-[17.54px] rounded-[12px] top-[-0.1px] w-[796.378px]" data-name="MeetingCard">
      <div className="box-border content-stretch flex flex-col h-[117.784px] items-start overflow-clip pb-[0.909px] pt-[16.903px] px-[16.903px] relative rounded-[inherit] w-[796.378px]">
        <Container31 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_2137)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 7.5L7.5 12.5" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 7.5L12.5 12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2137">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-gray-100 relative rounded-[12px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon14 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Felix</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2127)" id="Icon">
          <path d="M4.66619 1.16655V3.49964" id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M9.33239 1.16655V3.49964" id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p3c05b400} id="Vector_3" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M1.74982 5.83274H12.2488" id="Vector_4" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2127">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[51.378px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[51.378px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">monday</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon15 />
      <Paragraph7 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2163)" id="Icon">
          <path d={svgPaths.p1fb1e8c0} id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p1839c080} id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2163">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[85.043px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[85.043px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">15:35 - 17:35</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon16 />
      <Paragraph8 />
    </div>
  );
}

function Container36() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[3.999px] h-[71.981px] items-start relative w-full">
        <Container33 />
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[71.981px] items-start relative w-full">
        <Container32 />
        <Container36 />
      </div>
    </div>
  );
}

function MeetingCard2() {
  return <div className="absolute bg-[#6a7282] left-[8.91px] rounded-[1.5252e+07px] size-[5.994px] top-[7.91px]" data-name="MeetingCard" />;
}

function Badge2() {
  return (
    <div className="bg-gray-100 h-[21.811px] relative rounded-[10px] shrink-0 w-[94.51px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21.811px] overflow-clip relative rounded-[inherit] w-[94.51px]">
        <MeetingCard2 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[24.89px] not-italic text-[#364153] text-[12px] text-nowrap top-[3.36px] whitespace-pre">Cancelada</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.909px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex h-[71.981px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Badge2 />
    </div>
  );
}

function MeetingCard3() {
  return (
    <div className="absolute bg-[#fdfcfe] h-[117.784px] left-[17.54px] rounded-[12px] top-[129.68px] w-[796.378px]" data-name="MeetingCard">
      <div className="box-border content-stretch flex flex-col h-[117.784px] items-start overflow-clip pb-[0.909px] pt-[16.903px] px-[16.903px] relative rounded-[inherit] w-[796.378px]">
        <Container38 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_2137)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 7.5L7.5 12.5" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 7.5L12.5 12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2137">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-gray-100 relative rounded-[12px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon17 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Felix</p>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2127)" id="Icon">
          <path d="M4.66619 1.16655V3.49964" id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M9.33239 1.16655V3.49964" id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p3c05b400} id="Vector_3" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M1.74982 5.83274H12.2488" id="Vector_4" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2127">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[51.378px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[51.378px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">monday</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon18 />
      <Paragraph9 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2163)" id="Icon">
          <path d={svgPaths.p1fb1e8c0} id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p1839c080} id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2163">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[88.842px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[88.842px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">07:35 - 22:35</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon19 />
      <Paragraph10 />
    </div>
  );
}

function Container43() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[3.999px] h-[71.981px] items-start relative w-full">
        <Container40 />
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[71.981px] items-start relative w-full">
        <Container39 />
        <Container43 />
      </div>
    </div>
  );
}

function MeetingCard4() {
  return <div className="absolute bg-[#6a7282] left-[8.91px] rounded-[1.5252e+07px] size-[5.994px] top-[7.91px]" data-name="MeetingCard" />;
}

function Badge3() {
  return (
    <div className="bg-gray-100 h-[21.811px] relative rounded-[10px] shrink-0 w-[94.51px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21.811px] overflow-clip relative rounded-[inherit] w-[94.51px]">
        <MeetingCard4 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[24.89px] not-italic text-[#364153] text-[12px] text-nowrap top-[3.36px] whitespace-pre">Cancelada</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.909px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex h-[71.981px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Badge3 />
    </div>
  );
}

function MeetingCard5() {
  return (
    <div className="absolute bg-[#fdfcfe] h-[117.784px] left-[17.54px] rounded-[12px] top-[259.46px] w-[796.378px]" data-name="MeetingCard">
      <div className="box-border content-stretch flex flex-col h-[117.784px] items-start overflow-clip pb-[0.909px] pt-[16.903px] px-[16.903px] relative rounded-[inherit] w-[796.378px]">
        <Container45 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_2137)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 7.5L7.5 12.5" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 7.5L12.5 12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2137">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-gray-100 relative rounded-[12px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon20 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Felix</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2127)" id="Icon">
          <path d="M4.66619 1.16655V3.49964" id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M9.33239 1.16655V3.49964" id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p3c05b400} id="Vector_3" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M1.74982 5.83274H12.2488" id="Vector_4" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2127">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[51.186px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[51.186px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">tuesday</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon21 />
      <Paragraph11 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2163)" id="Icon">
          <path d={svgPaths.p1fb1e8c0} id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p1839c080} id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2163">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[88.636px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[88.636px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">00:35 - 18:35</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon22 />
      <Paragraph12 />
    </div>
  );
}

function Container50() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[3.998px] h-[71.981px] items-start relative w-full">
        <Container47 />
        <Container48 />
        <Container49 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[71.981px] items-start relative w-full">
        <Container46 />
        <Container50 />
      </div>
    </div>
  );
}

function MeetingCard6() {
  return <div className="absolute bg-[#6a7282] left-[8.91px] rounded-[1.5252e+07px] size-[5.994px] top-[7.91px]" data-name="MeetingCard" />;
}

function Badge4() {
  return (
    <div className="bg-gray-100 h-[21.811px] relative rounded-[10px] shrink-0 w-[94.51px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21.811px] overflow-clip relative rounded-[inherit] w-[94.51px]">
        <MeetingCard6 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[24.89px] not-italic text-[#364153] text-[12px] text-nowrap top-[3.36px] whitespace-pre">Cancelada</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.909px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex h-[71.981px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <Badge4 />
    </div>
  );
}

function MeetingCard7() {
  return (
    <div className="absolute bg-[#fdfcfe] h-[117.784px] left-[17.54px] rounded-[12px] top-[389.24px] w-[796.378px]" data-name="MeetingCard">
      <div className="box-border content-stretch flex flex-col h-[117.784px] items-start overflow-clip pb-[0.909px] pt-[16.903px] px-[16.903px] relative rounded-[inherit] w-[796.378px]">
        <Container52 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_2137)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 7.5L7.5 12.5" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 7.5L12.5 12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2137">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-gray-100 relative rounded-[12px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon23 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-0 not-italic text-[#2d3748] text-[16px] text-nowrap top-[-0.73px] tracking-[-0.3125px] whitespace-pre">Felix</p>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2127)" id="Icon">
          <path d="M4.66619 1.16655V3.49964" id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M9.33239 1.16655V3.49964" id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p3c05b400} id="Vector_3" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d="M1.74982 5.83274H12.2488" id="Vector_4" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2127">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[36.612px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[36.612px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">friday</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon24 />
      <Paragraph13 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[13.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2105_2163)" id="Icon">
          <path d={svgPaths.p1fb1e8c0} id="Vector" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
          <path d={svgPaths.p1839c080} id="Vector_2" stroke="var(--stroke-0, #5A6C6D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
        </g>
        <defs>
          <clipPath id="clip0_2105_2163">
            <rect fill="white" height="13.9986" width="13.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[86.769px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.993px] relative w-[86.769px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#5a6c6d] text-[14px] text-nowrap top-[0.36px] tracking-[-0.1504px] whitespace-pre">16:33 - 19:36</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[19.993px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon25 />
      <Paragraph14 />
    </div>
  );
}

function Container57() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[3.999px] h-[71.981px] items-start relative w-full">
        <Container54 />
        <Container55 />
        <Container56 />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="basis-0 grow h-[71.981px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[11.996px] h-[71.981px] items-start relative w-full">
        <Container53 />
        <Container57 />
      </div>
    </div>
  );
}

function MeetingCard8() {
  return <div className="absolute bg-[#6a7282] left-[8.91px] rounded-[1.5252e+07px] size-[5.994px] top-[7.91px]" data-name="MeetingCard" />;
}

function Badge5() {
  return (
    <div className="bg-gray-100 h-[21.811px] relative rounded-[10px] shrink-0 w-[94.51px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21.811px] overflow-clip relative rounded-[inherit] w-[94.51px]">
        <MeetingCard8 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[24.89px] not-italic text-[#364153] text-[12px] text-nowrap top-[3.36px] whitespace-pre">Cancelada</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.909px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex h-[71.981px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container58 />
      <Badge5 />
    </div>
  );
}

function MeetingCard9() {
  return (
    <div className="absolute bg-[#fdfcfe] h-[117.784px] left-[17.54px] rounded-[12px] top-[519.01px] w-[796.378px]" data-name="MeetingCard">
      <div className="box-border content-stretch flex flex-col h-[117.784px] items-start overflow-clip pb-[0.909px] pt-[16.903px] px-[16.903px] relative rounded-[inherit] w-[796.378px]">
        <Container59 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[636.903px] opacity-60 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_0px_1.818px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <MeetingCard1 />
      <MeetingCard3 />
      <MeetingCard5 />
      <MeetingCard7 />
      <MeetingCard9 />
    </div>
  );
}

function MeetingScheduler4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[814.19px]" data-name="MeetingScheduler">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[11.996px] h-full items-start relative w-[814.19px]">
        <Container24 />
        <Container60 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-[#fdfcfe] h-[804.702px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[29.993px] h-[804.702px] items-start pl-[24.908px] pr-[0.909px] py-[24.908px] relative w-full">
          <MeetingScheduler3 />
          <MeetingScheduler4 />
        </div>
      </div>
    </div>
  );
}

function MeetingScheduler5() {
  return (
    <div className="h-[1201.93px] relative shrink-0 w-[864.006px]" data-name="MeetingScheduler">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[23.999px] h-[1201.93px] items-start relative w-[864.006px]">
        <Card1 />
        <Card2 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[31.996px] h-[1659px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <Card />
      <MeetingScheduler5 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[47.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[24px] left-[407.08px] not-italic text-[#5a6c6d] text-[16px] text-center top-[-0.83px] tracking-[-0.3125px] translate-x-[-50%] w-[798px]">Como líder, tu rol es acompañar con amor y sin juicio. Recuerda que cada persona tiene su propio tiempo en el proceso de restauración.</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Italic',_sans-serif] font-normal italic leading-[24px] left-[406.51px] text-[#7eb3d5] text-[16px] text-center text-nowrap top-[-0.83px] tracking-[-0.3125px] translate-x-[-50%] whitespace-pre">{`"El que comenzó en vosotros la buena obra, la perfeccionará" — Filipenses 1:6`}</p>
    </div>
  );
}

function LeaderDashboard2() {
  return (
    <div className="h-[79.993px] relative shrink-0 w-[814.19px]" data-name="LeaderDashboard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[7.997px] h-[79.993px] items-start relative w-[814.19px]">
        <Paragraph15 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-[#fdfcfe] h-[129.808px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#e5dfe8] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[129.808px] items-start pb-[0.909px] pl-[24.908px] pr-[0.909px] pt-[24.908px] relative w-full">
          <LeaderDashboard2 />
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[23.998px] h-[1845px] items-start left-[87px] pb-0 pt-[31.996px] px-[15.994px] top-[85px] w-[896px]" data-name="Container">
      <PrimitiveDiv />
      <Card3 />
    </div>
  );
}

export default function RedimFinal() {
  return (
    <div className="bg-[#fdfcfb] relative size-full" data-name="Redim final">
      <Container3 />
      <Container61 />
    </div>
  );
}