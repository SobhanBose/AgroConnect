from sqlmodel import SQLModel
from uuid import UUID

from app.v1.utils import enumerations as enums


class OrderCreate(SQLModel):
    delivery_mode: enums.orderType
    payment_mode: enums.paymentMode


class TransactionCreate(SQLModel):
    mode: enums.transactionMode
    utr: str
    order_id: UUID
    amount: float
    transaction_status: enums.transactionStatus = enums.transactionStatus.success
