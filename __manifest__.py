{
    'name': 'Dashboard por defecto al iniciar sesión',
    'version': '1.0',
    'category': 'Extra Tools',
    'summary': 'Todos los usuarios aterrizan en el panel de aplicaciones (Home)',
    'description': """
        Al instalar este módulo, cualquier usuario (nuevo o existente)
        verá el Dashboard de aplicaciones justo después de iniciar sesión,
        en lugar del chat de Discuss.
    """,
    'author': 'Carlos TelecomTV',
    'depends': ['web'],
    'data': [],
    'installable': True,
    'application': False,
    'auto_install': False,
    'post_init_hook': 'set_default_action_home',
}
