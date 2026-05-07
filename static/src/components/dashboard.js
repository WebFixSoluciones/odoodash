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
            const rawApps = this.menuService.getApps();
            // Pre-procesamos las URLs de los íconos en JS para evitar errores en XML
            this.state.apps = rawApps.map(app => {
                let iconUrl = "/base/static/description/icon.png";
                if (app.webIconData) {
                    iconUrl = "data:image/png;base64," + app.webIconData;
                } else if (typeof app.webIcon === 'string') {
                    const parts = app.webIcon.split(',');
                    if (parts.length === 2) {
                        iconUrl = "/" + parts[0] + "/" + parts[1];
                    } else if (parts.length > 0) {
                        iconUrl = "/" + parts[0] + "/static/description/icon.png";
                    }
                }
                return Object.assign({}, app, { iconUrl: iconUrl });
            });
        });
    }

    openApp(app) {
        this.menuService.selectMenu(app);
    }
}

AppDashboard.template = "odoodash.AppDashboard";

registry.category("actions").add("odoodash.app_dashboard", AppDashboard);
