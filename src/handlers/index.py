from aiohttp import web

routes = web.RouteTableDef()


@routes.get('/')
async def index(request):
    return web.FileResponse('../static/index.html')


@routes.get('/index.js')
async def index(request):
    return web.FileResponse('../static/index.js')


@routes.get('/index.css')
async def index(request):
    return web.FileResponse('../static/index.css')
