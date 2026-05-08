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
            searchQuery: "",
        });

        onWillStart(async () => {
            const rawApps = this.menuService.getApps();
            // Pre-procesamos las URLs de los íconos — soporta PNG y SVG
            this.state.apps = rawApps.map(app => {
                let iconUrl = "/base/static/description/icon.png";
                if (app.webIconData) {
                    // Detectar MIME type real (PNG o SVG) — Odoo 19 usa ambos
                    const isSvg = app.webIconData.startsWith('PHN') || app.webIconData.startsWith('<');
                    const mimeType = isSvg ? "image/svg+xml" : "image/png";
                    iconUrl = `data:${mimeType};base64,` + app.webIconData;
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

    get filteredApps() {
        if (!this.state.searchQuery) {
            return this.state.apps;
        }
        const lowerCaseQuery = this.state.searchQuery.toLowerCase();
        return this.state.apps.filter(app =>
            app.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    openApp(app) {
        // Usar actionService si la app tiene una acción directa (más robusto)
        // Fallback a menuService.selectMenu para compatibilidad completa
        if (app.actionID) {
            this.actionService.doAction(app.actionID);
        } else {
            this.menuService.selectMenu(app);
        }
    }
}

AppDashboard.template = "odoodash.AppDashboard";

registry.category("actions").add("odoodash.app_dashboard", AppDashboard);
