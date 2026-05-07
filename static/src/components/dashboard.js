/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class AppDashboard extends Component {
    setup() {
        this.menuService = useService("menu");
        this.actionService = useService("action");
        this.state = useState({
            apps: [],
        });

        onWillStart(async () => {
            // Obtenemos todas las aplicaciones instaladas a las que tiene acceso el usuario
            this.state.apps = this.menuService.getApps();
        });
    }

    openApp(app) {
        // Redirigir a la app seleccionada usando el menuService nativo de Odoo
        this.menuService.selectMenu(app);
    }
}

AppDashboard.template = "odoodash.AppDashboard";

// Registramos el componente en el registry de "actions" de Odoo
registry.category("actions").add("odoodash.app_dashboard", AppDashboard);
