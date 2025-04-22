from enum import Enum


class produceTag(str, Enum):
    organic = "Organic"
    natural = "Natural"
    seasonal = "Seasonal"


class userType(str, Enum):
    consumer = "Consumer"
    farmer = "Farmer"


class orderStatus(str, Enum):
    pending = "Pending"
    completed = "Completed"
    cancelled = "Cancelled"
    packed = "Packed"


class paymentMode(str, Enum):
    pod = "POD"
    upi = "UPI"
    card = "Card"
    netbanking = "NetBanking"


class orderType(str, Enum):
    delivery = "Delivery"
    pickup = "Pickup"


class transactionStatus(str, Enum):
    pending = "Pending"
    success = "Success"
    failed = "Failed"


class transactionMode(str, Enum):
    pod = "POD"
    upi = "UPI"
    card = "Card"
    netbanking = "NetBanking"
