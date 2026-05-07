from odoo import http
from odoo.addons.web.controllers.home import Home

class CustomHome(Home):
    def _login_redirect(self, uid, redirect=None):
        # Redirigir siempre a nuestro dashboard al iniciar sesión si no hay otra redirección específica
        if not redirect:
            redirect = '/web#action=odoodash.action_app_dashboard'
        return super()._login_redirect(uid, redirect=redirect)
