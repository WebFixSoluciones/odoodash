from odoo import models, api, SUPERUSER_ID
import logging

_logger = logging.getLogger(__name__)

class ResUsers(models.Model):
    _inherit = 'res.users'

    @api.model
    def _default_action_id(self):
        """Sobrescribe el valor por defecto de action_id para nuevos usuarios."""
        home_action = self.env.ref('odoodash.action_app_dashboard', raise_if_not_found=False)
        if home_action:
            return home_action.id
        # Compatibilidad: _default_action_id puede no existir en todas las versiones de Odoo 19
        try:
            return super()._default_action_id()
        except AttributeError:
            return False


def set_default_action_home(cr, registry):
    """Post-install hook: asigna la acción Home a todos los usuarios humanos existentes
    que no tengan una acción de inicio configurada.
    Excluye: usuarios portal (share=True), usuarios inactivos, y OdooBot/sistema.
    """
    env = api.Environment(cr, SUPERUSER_ID, {})
    home_action = env.ref('odoodash.action_app_dashboard', raise_if_not_found=False)
    if not home_action:
        _logger.warning('odoodash: no se encontró action_app_dashboard, hook cancelado.')
        return
    # Solo usuarios internos activos (excluye portal, bots e inactivos)
    users_without_action = env['res.users'].search([
        ('action_id', '=', False),
        ('active', '=', True),
        ('share', '=', False),     # Excluye usuarios portal
        ('id', '!=', SUPERUSER_ID), # Excluye usuario administrador del sistema
    ])
    if users_without_action:
        users_without_action.write({'action_id': home_action.id})
        _logger.info(
            'odoodash: acción de inicio asignada a %d usuarios.',
            len(users_without_action)
        )
