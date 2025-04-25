import random
from app.v1.utils.database import SessionDep
from app.v1 import models
from fastapi import HTTPException, status
from twilio.rest import Client

from app.v1.config import settings


class OTPManager:
    """
    OTPManager is a class that handles the generation and verification of One-Time Passwords (OTPs).
    """

    @classmethod
    def generate_otp(self, otp_length: int, phone_no: int, db: SessionDep) -> int:
        """
        Generates a random OTP of the specified length.

        :return: A string representing the generated OTP.
        """
        lower_bound = 10 ** (otp_length - 1)
        upper_bound = (10**otp_length) - 1
        otp = random.randint(lower_bound, upper_bound)

        record = db.get(models.OTP, phone_no)

        if record:
            record.otp = otp
            db.add(record)
        else:
            record = models.OTP(phone_no=phone_no, otp=otp)
            db.add(record)

        db.flush()

        OTPManager.send_otp(phone_no, otp)

        db.commit()
        db.refresh(record)
        return True

    @classmethod
    def verify_otp(self, phone_no: int, otp: int, db: SessionDep) -> bool:
        """
        Verifies the OTP for a given phone number.

        :param phone_no: The phone number to verify the OTP against.
        :param otp: The OTP to verify.
        :return: True if the OTP is valid, False otherwise.
        """
        record = db.get(models.OTP, phone_no)

        if not record:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="OTP not found")

        if record.otp != otp:
            return False

        return True

    @classmethod
    def send_otp(self, phone_no: int, otp: int) -> bool:
        """
        Sends the OTP to the user's phone number.

        :param phone_no: The phone number to send the OTP to.
        :return: True if the OTP was sent successfully, False otherwise.
        """
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(body=f"Your OTP to AgroConnect is {otp}", from_=settings.TWILIO_PHONE_NO, to=f"+91{phone_no}")

        return message.sid is not None
