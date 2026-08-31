function Desgin(){
    return(
        <>
        {/* =====================================
    RESPONSIVE FIXED COLORFUL DECORATIONS
====================================== */}

<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

  {/* ================= LEFT DECORATION ================= */}
  <div className="
    absolute left-0 top-40
    hidden lg:block
    h-[clamp(500px,70vh,700px)]
    w-[clamp(220px,25vw,320px)]
  ">

    {/* Blue */}
    <div className="
      absolute -left-[clamp(80px,10vw,130px)] top-[5%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#0EA5E9]/20
    " />

    {/* Cyan */}
    <div className="
      absolute -left-[clamp(100px,12vw,160px)] top-[11%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#20B8C5]/25
    " />

    {/* Sky */}
    <div className="
      absolute -left-[clamp(120px,14vw,190px)] top-[17%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#38BDF8]/20
    " />

    {/* Purple */}
    <div className="
      absolute -left-[clamp(140px,16vw,220px)] top-[23%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#818CF8]/15
    " />

    {/* Glow */}
    <div className="
      absolute left-[clamp(40px,6vw,80px)] top-[25%]
      h-[clamp(50px,6vw,80px)]
      w-[clamp(50px,6vw,80px)]
      rounded-full
      bg-[#0EA5E9]/10
      blur-2xl
    " />

    {/* Dot */}
    <div className="
      absolute left-[clamp(50px,7vw,112px)] top-[30%]
      h-3 w-3
      rounded-full
      bg-[#20B8C5]/60
      shadow-lg shadow-[#20B8C5]/30
    " />

    {/* Purple Dot */}
    <div className="
      absolute left-[clamp(30px,4vw,48px)] top-[68%]
      h-2.5 w-2.5
      rounded-full
      bg-[#818CF8]/60
    " />

  </div>


  {/* ================= RIGHT DECORATION ================= */}
  <div className="
    absolute right-0 top-40
    hidden lg:block
    h-[clamp(500px,70vh,700px)]
    w-[clamp(220px,25vw,320px)]
  ">

    {/* Blue */}
    <div className="
      absolute -right-[clamp(80px,10vw,130px)] top-[5%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#0EA5E9]/20
    " />

    {/* Cyan */}
    <div className="
      absolute -right-[clamp(100px,12vw,160px)] top-[11%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#20B8C5]/25
    " />

    {/* Sky */}
    <div className="
      absolute -right-[clamp(120px,14vw,190px)] top-[17%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#38BDF8]/20
    " />

    {/* Purple */}
    <div className="
      absolute -right-[clamp(140px,16vw,220px)] top-[23%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#818CF8]/15
    " />

    {/* Glow */}
    <div className="
      absolute right-[clamp(40px,6vw,80px)] top-[25%]
      h-[clamp(50px,6vw,80px)]
      w-[clamp(50px,6vw,80px)]
      rounded-full
      bg-[#20B8C5]/10
      blur-2xl
    " />

    {/* Dot */}
    <div className="
      absolute right-[clamp(50px,7vw,112px)] top-[30%]
      h-3 w-3
      rounded-full
      bg-[#0EA5E9]/60
      shadow-lg shadow-[#0EA5E9]/30
    " />

    {/* Purple Dot */}
    <div className="
      absolute right-[clamp(30px,4vw,48px)] top-[68%]
      h-2.5 w-2.5
      rounded-full
      bg-[#818CF8]/60
    " />

  </div>


  {/* ================= SOFT GLOWS ================= */}

  <div className="
    absolute
    -left-[clamp(100px,15vw,160px)]
    -top-[clamp(100px,15vw,160px)]
    h-[clamp(250px,30vw,384px)]
    w-[clamp(250px,30vw,384px)]
    rounded-full
    bg-[#0EA5E9]/5
    blur-3xl
  " />

  <div className="
    absolute
    -bottom-[clamp(100px,15vw,160px)]
    -right-[clamp(100px,15vw,160px)]
    h-[clamp(250px,30vw,384px)]
    w-[clamp(250px,30vw,384px)]
    rounded-full
    bg-[#20B8C5]/5
    blur-3xl
  " />

</div>
</>


    );

}
export default Desgin;