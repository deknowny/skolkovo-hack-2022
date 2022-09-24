import dataclasses
import typing


DirectionKind = typing.Literal["long", "short"]


@dataclasses.dataclass
class Position:
    id: int
    price_usd: int
    direction: DirectionKind
    amount_usd: int


class Contract:
    positions: dict[address, dict[int, Poisiton]]
    total_liquidity_usd: int

    def mint(
        self,
        price_usd: int,
        direction: DirectionKind,
    ) -> int:
        ...

    def burn(self, position_id: int):
        ...
