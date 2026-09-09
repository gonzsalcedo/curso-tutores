(function () {
    // Prevent multiple injections
    if (document.getElementById('chatac-widget-container')) return;

    // Get the assistant ID from the script tag's src query param
    const currentScript = document.currentScript || 
                          document.getElementById('chatac-active-script') ||
                          document.getElementById('chatac-script') || 
                          document.getElementById('chatac-script-injected') ||
                          document.querySelector('script[src*="widget.js"]');
    let assistantId = '73c922f5-e306-486a-8510-24cf7722d1f2';
    let hostUrl = 'https://chatac.vercel.app';

    if (currentScript) {
        const src = currentScript.getAttribute('src');
        if (src) {
            try {
                const url = new URL(src, window.location.href);
                const queryId = url.searchParams.get('id');
                if (queryId) assistantId = queryId;
                if (url.origin && url.origin !== window.location.origin && url.origin !== 'null' && !url.origin.startsWith('file:')) {
                    hostUrl = url.origin;
                }
            } catch (e) {}
        }
    }

    if (!assistantId) {
        console.error('ChatAC Widget: No assistant ID provided.');
        return;
    }

    // Inject styles
    const style = document.createElement('style');
    style.innerHTML = `
        #chatac-widget-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* The Chat Bubble Button */
        #chatac-bubble-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%);
            box-shadow: 0 4px 14px 0 rgba(168, 85, 247, 0.39);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            position: relative;
        }

        #chatac-bubble-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px 0 rgba(168, 85, 247, 0.5);
        }

        /* Icon inside bubble */
        #chatac-bubble-icon {
            width: 30px;
            height: 30px;
            fill: none;
            stroke: white;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        #chatac-close-icon {
            width: 24px;
            height: 24px;
            fill: none;
            stroke: white;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            position: absolute;
            opacity: 0;
            transform: rotate(-90deg) scale(0.5);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        #chatac-widget-container.open #chatac-bubble-icon {
            opacity: 0;
            transform: rotate(90deg) scale(0.5);
        }

        #chatac-widget-container.open #chatac-close-icon {
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }

        /* Tooltip Message */
        #chatac-tooltip {
            position: absolute;
            right: 75px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            color: #1f2937;
            padding: 10px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            white-space: normal;
            word-wrap: break-word;
            line-height: 1.35;
            max-width: calc(100vw - 120px);
            width: max-content;
            box-sizing: border-box;
            box-shadow: 0 4px 14px rgba(0,0,0,0.12);
            opacity: 1;
            transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            animation: chatac-bounce 2s infinite;
        }

        #chatac-tooltip.chatac-tooltip-hidden {
            opacity: 0 !important;
            transform: translateY(-50%) translateX(10px) !important;
            pointer-events: none !important;
        }

        /* Small triangle for tooltip */
        #chatac-tooltip::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 6px 0 6px 6px;
            border-style: solid;
            border-color: transparent transparent transparent white;
        }

        #chatac-widget-container.open #chatac-tooltip {
            opacity: 0;
            transform: translateY(-50%) translateX(-10px);
            pointer-events: none;
        }

        @keyframes chatac-bounce {
            0%, 100% { transform: translateY(-50%) translateX(0); }
            50% { transform: translateY(-50%) translateX(-5px); }
        }

        /* Iframe Window */
        #chatac-iframe-container {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 600px;
            max-height: calc(100vh - 100px);
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform-origin: bottom right;
        }

        #chatac-widget-container.open #chatac-iframe-container {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        #chatac-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            #chatac-widget-container {
                bottom: 84px;
                right: 16px;
            }
            #chatac-tooltip {
                right: 70px;
                font-size: 13px;
                padding: 8px 12px;
                max-width: calc(100vw - 110px);
                line-height: 1.25;
            }
            #chatac-iframe-container {
                position: fixed;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
                max-height: 100vh;
                border-radius: 0;
            }
            #chatac-widget-container.open #chatac-bubble-btn {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Create Container
    const container = document.createElement('div');
    container.id = 'chatac-widget-container';

    // Create Tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'chatac-tooltip';
    const customText = currentScript ? currentScript.getAttribute('data-message') : null;
    tooltip.innerText = customText || '¿Tienes dudas sobre cómo empaquetar tu curso? ¡Escríbeme! 👋';

    // Create Button
    const btn = document.createElement('div');
    btn.id = 'chatac-bubble-btn';
    
    btn.innerHTML = `
        <svg id="chatac-bubble-icon" viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <svg id="chatac-close-icon" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

    // Create Iframe Container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'chatac-iframe-container';

    // Create Iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'chatac-iframe';
    iframe.src = `${hostUrl}/widget/${assistantId}`;
    iframe.allow = "microphone";

    iframeContainer.appendChild(iframe);
    
    // Assemble
    container.appendChild(iframeContainer);
    container.appendChild(tooltip);
    container.appendChild(btn);
    document.body.appendChild(container);

    // Auto-hide tooltip after 6 seconds
    let isOpen = false;
    setTimeout(() => {
        if (tooltip && !isOpen) {
            tooltip.classList.add('chatac-tooltip-hidden');
            setTimeout(() => {
                if (tooltip && !isOpen) {
                    tooltip.style.display = 'none';
                }
            }, 600);
        }
    }, 6000);

    // Interactions
    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            container.classList.add('open');
            tooltip.style.display = 'none'; 
        } else {
            container.classList.remove('open');
        }
    });

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CHATAC_CLOSE') {
            isOpen = false;
            container.classList.remove('open');
        }
    });

})();
