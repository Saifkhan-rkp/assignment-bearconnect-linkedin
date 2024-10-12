import os
from pathlib import Path

HOME_DIR = str(Path.home())
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
LINKEDIN_API_USER_DIR = os.path.join(ROOT_DIR, "py_scripts/")
COOKIE_PATH = os.path.join(ROOT_DIR, "cookies/")
OTP_DUMP_PATH = os.path.join(ROOT_DIR, "otp-dumps/")
