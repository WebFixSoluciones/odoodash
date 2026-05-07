{
    'name': 'Dashboard de Aplicaciones Odoo Community',
    'version': '19.0.1.0.0',
    'category': 'Extra Tools',
    'summary': 'Añade el Dashboard visual de aplicaciones (Home) y lo pone por defecto',
    'description': """
        Este módulo crea un Dashboard visual de aplicaciones (similar a la versión Enterprise)
        y redirige a todos los usuarios a él después de iniciar sesión.
    """,
    'author': 'Carlos TelecomTV',
    'depends': ['web'],
    'data': [
        'views/dashboard_action.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'odoodash/static/src/components/dashboard.js',
            'odoodash/static/src/components/dashboard.xml',
            'odoodash/static/src/components/dashboard.scss',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'post_init_hook': 'set_default_action_home',
}
