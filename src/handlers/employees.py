import json

from aiohttp import web

import database.employees
from models import EmployeePost

routes = web.RouteTableDef()


@routes.view('/employees')
class EmployeeView(web.View):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.db = database.employees.EmployeesDB()

    async def get(self):
        employees = await self.db.get_employees()
        return web.json_response(employees, dumps=lambda x: json.dumps(x, default=str))

    async def post(self):
        data = await self.request.json()
        if data.get('post') != EmployeePost.chief.value and data.get('chief_id') is None:
            return web.json_response({"error": "chief_id is required for non-chief employee"}, status=400)

        r = await self.db.create_employee(data)
        return web.json_response({"data": str(r)})

    async def put(self):
        employee_id, data = self.request.query.get('id'), await self.request.json()

        if not employee_id or not data:
            return web.json_response({"error": "id and data is required"}, status=400)

        if await self.db.update_employee(employee_id, data):
            return web.json_response({"data": "updated"})
        return web.json_response({"data": "was not updated"})


@routes.get('/employees/tree')
async def get(request):
    db = database.employees.EmployeesDB()
    employees = await db.get_tree()

    return web.json_response(employees, dumps=lambda x: json.dumps(x, default=str))
