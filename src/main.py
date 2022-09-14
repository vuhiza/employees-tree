from aiohttp import web
from sqlmodel import SQLModel

from config import settings
from handlers import employees


async def migrate():
    async with settings.db.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


app = web.Application()
app.add_routes(employees.routes)

if __name__ == '__main__':
    # NOTE: This is not a production code, it's better to use alembic for migrations
    import asyncio

    asyncio.run(migrate())

    web.run_app(app)
