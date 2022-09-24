import dataclasses
import typing


@dataclasses.dataclass
class Position:
    id: int
    price_usd: int
    direction: typing.Literal["long", "short"]
    amount_usd: int


class Contract:
    positions: dict[address, ]
