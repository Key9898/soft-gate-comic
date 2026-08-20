export interface RankMarkProps {
  rank: number
}

const RankMark = ({ rank }: RankMarkProps) => (
  <span
    data-testid="rank-mark"
    className="pointer-events-none absolute bottom-0 left-1 z-20 text-2xl leading-none font-black tabular-nums sm:text-3xl"
    aria-hidden="true"
  >
    <span
      className="absolute bottom-0 left-0 origin-center scale-[1.2] text-white"
      aria-hidden="true"
    >
      {rank}
    </span>
    <span className="relative z-10 text-white [-webkit-text-stroke:3px_#0e9494] [paint-order:stroke_fill]">
      {rank}
    </span>
  </span>
)

export default RankMark
