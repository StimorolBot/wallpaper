import os
import logging


class ColoredFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': '\033[94m', 'INFO': '\033[92m',
        'WARNING': '\033[93m', 'ERROR': '\033[91m',
        'CRITICAL': '\033[95m'
    }

    def format(self, record):
        log_fmt = f"{self.COLORS.get(record.levelname)}%(levelname)s:   \033[97m %(message)s"
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


class CustomLogger(ColoredFormatter):
    def __init__(self, loger_name: str, path: str, lvl: int = logging.DEBUG):
        super().__init__()
        self.path = path
        self.logger = logging.getLogger(name=loger_name)
        self.logger.setLevel(lvl)
        self.format = "%(levelname)-7s:   %(module)15s:%(lineno)-3d   %(asctime)s -> %(message)s"

        self.terminal_log = logging.StreamHandler()
        self.terminal_log.setLevel(lvl)
        self.terminal_log.setFormatter(ColoredFormatter())
        self.logger.addHandler(self.terminal_log)

        self.file_log = logging.FileHandler(filename=self.path)
        self.file_log.setLevel(lvl)
        self.file_log.setFormatter(logging.Formatter(self.format))
        self.logger.addHandler(self.file_log)


PATH = f"{os.path.dirname(os.path.abspath(__file__))}/../.log"

CustomLogger(loger_name="img_logger", path=f"{PATH}/img.log")
CustomLogger(loger_name="auth_logger", path=f"{PATH}/auth.log")
CustomLogger(loger_name="smtp_logger", path=f"{PATH}/smtp.log")
CustomLogger(loger_name="rmq_logger", path=f"{PATH}/rmq.log")
CustomLogger(loger_name="os_logger", path=f"{PATH}/os.log")
CustomLogger(loger_name="user_logger", path=f"{PATH}/user.log")

img_logger = logging.getLogger("img_logger")
auth_logger = logging.getLogger("auth_logger")
smtp_logger = logging.getLogger("smtp_logger")
rmq_logger = logging.getLogger("rmq_logger")
os_logger = logging.getLogger("os_logger")
user_logger = logging.getLogger("user_logger")
