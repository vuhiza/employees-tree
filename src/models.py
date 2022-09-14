import datetime
import enum
import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy import Column, VARCHAR
from sqlmodel import SQLModel, Field


class EmployeePost(enum.Enum):
    chief = "chief"


class Employee(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    first_name: str = Field(sa_column=Column(VARCHAR(255)), nullable=False)
    last_name: str = Field(sa_column=Column(VARCHAR(255)), nullable=False)
    patronymic_name: str = Field(sa_column=Column(VARCHAR(255)), nullable=False)
    # Better to use another table as a foreign key for this
    post: str
    employment_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    salary: Decimal = Field(default=0.0)

    chief_id: Optional[uuid.UUID] = Field(default=None)
