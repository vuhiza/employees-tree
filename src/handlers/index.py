import json

from aiohttp import web

import database.employees
from models import EmployeePost

routes = web.RouteTableDef()


@routes.view('/index')
class EmployeeView(web.View):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.db = database.employees.EmployeesDB()

    async def get(self):
        employees = await self.db.get_employees()
        return web.json_response(employees, dumps=lambda x: json.dumps(x, default=str))
