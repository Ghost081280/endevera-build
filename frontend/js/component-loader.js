/* ============================================
   ENDEVERA COMPONENT LOADER
   Dynamically loads and injects HTML components
   ============================================ */

(function() {
    'use strict';

    // Component registry
    const COMPONENTS = {
        'scroll-progress': {
            path: 'components/scroll-progress.html',
            target: 'prepend-body'
        },
        'nav': {
            path: 'components/nav.html',
            target: 'prepend-body',
            script: 'js/components/nav.js'
        },
        'footer': {
            path: 'components/footer.html',
            target: 'append-body'
        },
        'back-to-top': {
            path: 'components/back-to-top.html',
            target: 'append-body',
            script: 'js/components/back-to-top.js'
        },
        'cookie-banner': {
            path: 'components/cookie-banner.html',
            target: 'append-body',
            script: 'js/components/cookie-banner.js'
        },
        'chatbot': {
            path: 'components/chatbot/chatbot.html',
            target: 'append-body',
            css: 'components/chatbot/chatbot.css',
            script: 'components/chatbot/chatbot.js'
        }
    };

    const PAGE_CONFIGS = {
        'public': ['scroll-progress', 'nav', 'footer', 'back-to-top', 'cookie-banner', 'chatbot'],
        'portal': ['scroll-progress', 'nav-member', 'footer', 'back-to-top', 'chatbot'],
        'login': ['scroll-progress', 'footer']
    };

    let pageType = document.body.getAttribute('data-page-type') || 'public';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        await loadComponents();
    }

    async function loadComponents() {
        const componentsToLoad = PAGE_CONFIGS[pageType] || PAGE_CONFIGS['public'];
        
        try {
            const loadPromises = componentsToLoad.map(componentName => {
                const component = COMPONENTS[componentName];
                if (!component) {
                    console.warn(`Component "${componentName}" not found`);
                    return Promise.resolve();
                }
                return loadComponent(componentName, component);
            });

            await Promise.all(loadPromises);
            document.dispatchEvent(new CustomEvent('endevera:components-loaded'));
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    async function loadComponent(name, config) {
        try {
            if (config.css) {
                await loadCSS(config.css);
            }

            const html = await fetchHTML(config.path);
            injectHTML(html, config.target);

            if (config.script) {
                await loadScript(config.script);
            }

            return true;
        } catch (error) {
            console.error(`Error loading component "${name}":`, error);
            return false;
        }
    }

    async function fetchHTML(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    }

    function injectHTML(html, target) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const nodes = Array.from(tempDiv.childNodes);

        switch(target) {
            case 'prepend-body':
                nodes.reverse().forEach(node => {
                    if (node.nodeType === 1 || node.nodeType === 3) {
                        document.body.insertBefore(node, document.body.firstChild);
                    }
                });
                break;
            
            case 'append-body':
                nodes.forEach(node => {
                    if (node.nodeType === 1 || node.nodeType === 3) {
                        document.body.appendChild(node);
                    }
                });
                break;
            
            default:
                const targetElement = document.querySelector(target);
                if (targetElement) {
                    nodes.forEach(node => {
                        if (node.nodeType === 1 || node.nodeType === 3) {
                            targetElement.appendChild(node);
                        }
                    });
                }
        }
    }

    function loadCSS(path) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${path}"]`)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load CSS: ${path}`));
            document.head.appendChild(link);
        });
    }

    function loadScript(path) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${path}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = path;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${path}`));
            document.body.appendChild(script);
        });
    }

    window.EndevereLoader = {
        loadComponent: async function(componentName) {
            const component = COMPONENTS[componentName];
            if (!component) {
                console.error(`Component "${componentName}" not found`);
                return false;
            }
            return await loadComponent(componentName, component);
        },
        getLoadedComponents: function() {
            return PAGE_CONFIGS[pageType] || [];
        },
        pageType: pageType
    };

})();
