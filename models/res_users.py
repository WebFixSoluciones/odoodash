from odoo import models, api, SUPERUSER_ID

class ResUsers(models.Model):
    _inherit = 'res.users'

    @api.model
    def _default_action_id(self):
        """Sobrescribe el valor por defecto de action_id para nuevos usuarios."""
        home_action = self.env.ref('odoodash.action_app_dashboard', raise_if_not_found=False)
        return home_action.id if home_action else super()._default_action_id()


def set_default_action_home(cr, registry):
    """Post-install hook: asigna la acción Home a todos los usuarios existentes
    que no tengan una acción de inicio configurada."""
    env = api.Environment(cr, SUPERUSER_ID, {})
    home_action = env.ref('odoodash.action_app_dashboard', raise_if_not_found=False)
    if not home_action:
        return
    users_without_action = env['res.users'].search([('action_id', '=', False)])
    if users_without_action:
        users_without_action.write({'action_id': home_action.id})
