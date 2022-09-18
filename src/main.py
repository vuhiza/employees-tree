import logging

from aiohttp import web
from handlers import employees, index

# Add logging
logging.basicConfig(level=logging.DEBUG)

app = web.Application()
app.add_routes(employees.routes)
app.add_routes(index.routes)

if __name__ == '__main__':
    web.run_app(app)
