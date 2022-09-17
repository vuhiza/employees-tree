import json

from aiohttp import web

import database.employees
from models import EmployeePost

routes = web.RouteTableDef()


@routes.view('/employees')
class EmployeeView(web.View):

    def is_form(self) -> bool:
        return self.request.content_type == 'application/x-www-form-urlencoded'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.db = database.employees.EmployeesDB()

    async def get(self):
        employees = await self.db.get_employees()
        return web.json_response(employees, dumps=lambda x: json.dumps(x, default=str))

    async def post(self):
        # Extract data from request. Maybe this logic should be moved to a separate function(decorator-like)
        data = await self.request.post() if self.is_form() else await self.request.json()

        # Also, i now quite sure that this is not the best way to validate data.
        # In fastapi this logic is moved to pydantic models, but i don't know how to do it simple in aiohttp
        if data.get('post') != EmployeePost.chief.value and data.get('chief_id') is None:
            return web.json_response({"error": "chief_id is required for non-chief employee"}, status=400)

        r = await self.db.create_employee(data)
        return web.json_response({"data": str(r)})

    @staticmethod
    @routes.get('/employees/tree')
    async def get_tree(request):
        # It should be implemented with dependency injection
        db = database.employees.EmployeesDB()
        employees = await db.get_tree()

        return web.json_response(employees, dumps=lambda x: json.dumps(x, default=str))

    @staticmethod
    @routes.post('/employees/update')
    async def update(request):
        db = database.employees.EmployeesDB()
        employee_id, data = request.query.get('id'), await request.post()

        if not employee_id or not data:
            return web.json_response({"error": "id and data is required"}, status=400)

        if await db.update_employee(employee_id, dict(data)):
            return web.json_response({"data": "updated"})
        return web.json_response({"data": "was not updated"})
