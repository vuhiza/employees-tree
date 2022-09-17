import asyncio
from typing import Any

from sqlmodel import select, insert, update

from config import settings
from models import Employee


class EmployeesDB:
    def __init__(self):
        self.db = settings.db

    async def get_employees(self) -> list[dict]:
        async with self.db.begin() as conn:
            result = (await conn.execute(select(Employee))).fetchall()

            return [dict(r) for r in result]

    async def create_employee(self, employee: dict) -> type(Employee.id):
        async with self.db.begin() as conn:
            r = await conn.execute(insert(Employee).values(**employee))

            return r.inserted_primary_key[0] if r.inserted_primary_key else None

    async def update_employee(self, employee_id: str, employee: dict) -> bool:
        async with self.db.begin() as conn:
            stmt = update(Employee).where(Employee.id == employee_id).values(**employee)
            r = await conn.execute(stmt)

            return True if r.rowcount else False

    async def get_childs(self, employee_id: str) -> list[dict]:
        async with self.db.begin() as conn:
            result = (await conn.execute(select(Employee).where(Employee.chief_id == employee_id))).fetchall()

            return [dict(r) for r in result]

    async def get_childs_recursive(self, employee_id: str) -> list[dict] | Any:
        children = await self.get_childs(employee_id)

        async def _assign_childs(child: dict) -> dict:
            child['childs'] = await self.get_childs_recursive(child.get('id'))
            return child

        children = await asyncio.gather(*[_assign_childs(child) for child in children])

        return children

    async def get_tree(self):
        async with self.db.begin() as conn:
            r = []

            result = (await conn.execute(select(Employee).where(Employee.chief_id == None))).fetchall()

            for employee in [dict(r) for r in result]:
                employee['childs'] = await self.get_childs_recursive(employee.get('id'))
                r.append(employee)
            return r
