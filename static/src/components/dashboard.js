/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

// Paths SVG vectoriales de las aplicaciones comunes con sus colores de tema dedicados
const SVG_ICONS = {
    inicio: {
        path: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
        color: "#8B5CF6" // Violeta
    },
    conversaciones: {
        path: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        color: "#0EA5E9" // Celeste
    },
    discuss: {
        path: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        color: "#0EA5E9"
    },
    tableros: {
        path: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="9" y1="9" x2="21" y2="9"/><line x1="9" y1="15" x2="21" y2="15"/>',
        color: "#6366F1" // Indigo
    },
    dashboards: {
        path: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="9" y1="9" x2="21" y2="9"/><line x1="9" y1="15" x2="21" y2="15"/>',
        color: "#6366F1"
    },
    "punto de venta": {
        path: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
        color: "#F97316" // Naranja (Punto de Venta)
    },
    pos: {
        path: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
        color: "#F97316"
    },
    facturación: {
        path: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
        color: "#EAB308" // Amarillo
    },
    facturacion: {
        path: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
        color: "#EAB308"
    },
    invoicing: {
        path: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
        color: "#EAB308"
    },
    inventario: {
        path: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
        color: "#0EA5E9" // Azul (Inventario)
    },
    inventory: {
        path: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
        color: "#0EA5E9"
    },
    aplicaciones: {
        path: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
        color: "#EC4899" // Rosado
    },
    apps: {
        path: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
        color: "#EC4899"
    },
    ajustes: {
        path: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
        color: "#94A3B8" // Slate
    },
    settings: {
        path: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
        color: "#94A3B8"
    }
};

const STROKE_COLORS = [
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#8B5CF6", // Purple
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#6366F1", // Indigo
];

const getColorByName = (name) => {
    let hash = 0;
    const cleanName = name || "?";
    for (let i = 0; i < cleanName.length; i++) {
        hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % STROKE_COLORS.length;
    return STROKE_COLORS[index];
};

const generateSvgIcon = (pathSvg, strokeColor) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <g fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(20, 20) scale(2.5)">
            ${pathSvg}
        </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const generateLetterIcon = (name, strokeColor) => {
    const letter = (name || "?").charAt(0).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${strokeColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="500" font-size="48">${letter}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export class AppDashboard extends Component {
    setup() {
        this.menuService = useService("menu");
        this.actionService = useService("action");
        this.state = useState({
            apps: [],
            searchQuery: "",
            companyName: "Odoo",
            userName: "Usuario",
            userInitial: "U",
            avatarUrl: "",
            isDebugMode: false,
        });

        onWillStart(async () => {
            const rawApps = this.menuService.getApps();
            
            // Detección dinámica del prefijo de subdirectorio (ej. /odoo) en el reverse proxy
            const path = window.location.pathname;
            const parts = path.split('/');
            const prefix = (parts.length > 2 && parts[1] && parts[1] !== 'web') ? '/' + parts[1] : '';

            // Cargar datos reales de la sesión Odoo
            const sessionInfo = window.odoo.session_info || {};
            this.state.companyName = sessionInfo.company_name || 
                (sessionInfo.user_companies && sessionInfo.user_companies.current_company && sessionInfo.user_companies.current_company.name) || 
                "Odoo";
            this.state.userName = sessionInfo.name || "Usuario";
            this.state.userInitial = this.state.userName.charAt(0).toUpperCase();
            
            const partnerId = sessionInfo.partner_id;
            this.state.avatarUrl = partnerId ? `${prefix}/web/image?model=res.partner&field=avatar_128&id=${partnerId}` : '';
            this.state.isDebugMode = window.odoo.debug !== "";

            this.state.apps = rawApps.map(app => {
                const nameKey = app.name.toLowerCase().trim();
                let iconUrl = "";
                let themeColor = "#FFFFFF";

                // Determinar el color de tema
                if (SVG_ICONS[nameKey]) {
                    themeColor = SVG_ICONS[nameKey].color;
                    iconUrl = generateSvgIcon(SVG_ICONS[nameKey].path, themeColor);
                } else {
                    themeColor = getColorByName(app.name);
                    if (app.webIconData) {
                        const isSvg = app.webIconData.startsWith('PHN') || app.webIconData.startsWith('<');
                        const mimeType = isSvg ? "image/svg+xml" : "image/png";
                        iconUrl = `data:${mimeType};base64,` + app.webIconData;
                    } else if (typeof app.webIcon === 'string') {
                        const partsIcon = app.webIcon.split(',');
                        if (partsIcon.length === 2) {
                            iconUrl = `${prefix}/${partsIcon[0]}/${partsIcon[1]}`;
                        } else if (partsIcon.length > 0) {
                            iconUrl = `${prefix}/${partsIcon[0]}/static/description/icon.png`;
                        }
                    }
                }

                // Fallback default
                if (!iconUrl) {
                    iconUrl = `${prefix}/base/static/description/icon.png`;
                }

                // Generar variables de estilo CSS en línea para degradados e iluminación por color
                // Suffixes hex para opacidad: 26 = 15%, 08 = 3%, 40 = 25%, 12 = 7%
                const styleStr = `--app-theme-color: ${themeColor}; --app-theme-color-bg1: ${themeColor}26; --app-theme-color-bg2: ${themeColor}08; --app-theme-color-border: ${themeColor}40; --app-theme-color-shadow: ${themeColor}12;`;

                return Object.assign({}, app, { 
                    iconUrl: iconUrl,
                    styleStr: styleStr,
                    themeColor: themeColor
                });
            });
        });
    }

    getFallbackIcon(app) {
        const nameKey = app.name.toLowerCase().trim();
        if (SVG_ICONS[nameKey]) {
            return generateSvgIcon(SVG_ICONS[nameKey].path, SVG_ICONS[nameKey].color);
        }
        const color = getColorByName(app.name);
        return generateLetterIcon(app.name, color);
    }

    handleIconError(ev, app) {
        const fallbackUrl = this.getFallbackIcon(app);
        if (ev.target.src !== fallbackUrl) {
            ev.target.setAttribute("src", fallbackUrl);
        }
    }

    openDiscuss() {
        this.actionService.doAction("mail.action_discuss");
    }

    toggleDebug() {
        const url = new URL(window.location.href);
        const currentDebug = url.searchParams.get("debug");
        if (currentDebug !== null) {
            url.searchParams.delete("debug");
        } else {
            url.searchParams.set("debug", "1");
        }
        window.location.href = url.toString();
    }

    openPreferences() {
        this.actionService.doAction("base.action_res_users_my");
    }

    getFilteredApps() {
        if (!this.state.searchQuery) {
            return this.state.apps;
        }
        const lowerCaseQuery = this.state.searchQuery.toLowerCase();
        return this.state.apps.filter(app =>
            app.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    get filteredApps() {
        return this.getFilteredApps();
    }

    openApp(app) {
        if (app.actionID) {
            this.actionService.doAction(app.actionID);
        } else {
            this.menuService.selectMenu(app);
        }
    }
}

AppDashboard.template = "odoodash.AppDashboard";

registry.category("actions").add("odoodash.app_dashboard", AppDashboard);
