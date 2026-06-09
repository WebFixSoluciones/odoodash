from odoo import models, api

class ResUsers(models.Model):
    _inherit = 'res.users'

    @api.model
    def _default_action_id(self):
        home_action = self.env.ref('odoodash.action_app_dashboard', raise_if_not_found=False)
        return home_action.id if home_action else super()._default_action_id()


def set_default_action_home(env):
    """Post-init hook compatible con Odoo 19 (recibe solo env)."""
    home_action = env.ref('odoodash.action_app_dashboard', raise_if_not_found=False)
    if not home_action:
        return
    users_without_action = env['res.users'].search([
        ('action_id', '=', False),
        ('active', '=', True),
        ('share', '=', False),
        ('id', '!=', 1),
    ])
    if users_without_action:
        users_without_action.write({'action_id': home_action.id})
