from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String, Date, Float
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
import datetime
class Base(DeclarativeBase):
	pass

class Transactions(Base):
	__tablename__ = "transactions"
	id: Mapped[int] = mapped_column(primary_key=True)
	transaction_date: Mapped[datetime.date] = mapped_column(Date)
	description: Mapped[str] = mapped_column(String) 
	amount: Mapped[float] = mapped_column(Float)
	category: Mapped[str] = mapped_column(String) 
	bank: Mapped[str] = mapped_column(String)  


	def __repr__(self) -> str:
		return f"Transactions(id={self.id!r}, transaction_date={self.transaction_date!r}, category={self.category!r}, amount={self.amount!r} bank={self.bank!r})"
