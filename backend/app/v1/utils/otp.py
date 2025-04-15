import random


def generate_otp(num_digits: int) -> int:
    """
    Generate a 4-digit OTP code.
    """

    lower_bound = 10 ** (num_digits - 1)
    upper_bound = (10**num_digits) - 1
    return random.randint(lower_bound, upper_bound)
