from enum import Enum


class FilterTime(Enum):
    HOUR = "HOUR"
    DAY = "DAY"
    WEEK = "WEEK"
    MONTH = "MOUNT"
    YEAR = "YEAR"
    ALL = "ALL"
