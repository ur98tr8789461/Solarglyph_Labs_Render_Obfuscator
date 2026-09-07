/* =====================================================================
   SHARED SITE COMPONENTS
   <site-nav> and <site-footer> custom elements. Define the markup once
   here and every page just drops in the tag instead of copy-pasting
   the nav/footer HTML.

   Usage:
     <site-nav page="home"></site-nav>   <!-- on the homepage: scroll-to-section links -->
     <site-nav></site-nav>               <!-- on any other page: links back + Discord CTA -->

     <site-footer></site-footer>                             <!-- default terms link: /termsandconditions -->
     <site-footer terms-href="/termsandconditions"></site-footer>  <!-- override if needed -->
===================================================================== */

const LOGO_URL = 'https://www.solarglyphlabs.com/images/Logo/SolarglyphLabsLogoCut.png';
const LOGOUNCUT_URL = 'https://www.solarglyphlabs.com/images/Logo/SolarglyphLabsLogo.png';
const MAIN_SITE_URL = 'https://www.solarglyphlabs.com';
const OBFUSCATE_HOME_URL = '/';
const APP_URL = '/Signup.html';
const STATUS_URL = `${MAIN_SITE_URL}/status`;
const TERMS_URL = `${MAIN_SITE_URL}/termsandconditions`;
const DISCORD_URL = 'https://discord.gg/CZaJZCxJxp';
const DOCS_URL = 'https://solarglyph-labs.gitbook.io/solarglyph-labs';

class SiteNav extends HTMLElement {
    connectedCallback() {
        const mode = this.getAttribute('page') || 'sub';
        const isToolHome = mode === 'tool';

        // Logo always returns to the main Solarglyph Labs site — this subdomain
        // is a product under that brand, not a separate home.
        const logo = `<a href="${MAIN_SITE_URL}" class="flex-shrink-0 flex items-center cursor-pointer group">
                    <img class="h-8 w-auto mr-3 object-contain group-hover:scale-105 transition-transform"
                         src="${LOGO_URL}"
                         alt="Solarglyph Labs Logo"
                         onerror="this.style.display='none'; document.getElementById('logo-text').classList.remove('hidden');">
                    <span id="logo-text" class="font-semibold text-lg tracking-tight hidden">Solarglyph Labs</span>
               </a>`;

        // The dropdown component for Docs
        const docsDropdown = `
            <div class="relative group cursor-pointer">
                <div class="flex items-center gap-1 text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors py-2">
                    Docs
                    <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"></i>
                </div>
                
                <!-- Invisible bridge to keep hover state active while moving mouse down -->
                <div class="absolute left-0 top-full h-2 w-full"></div>
                
                <!-- Dropdown Menu -->
                <div class="absolute left-0 top-[calc(100%+0.5rem)] w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div class="rounded-xl shadow-xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/10 overflow-hidden backdrop-blur-lg">
                        <!-- Add your specific product docs below -->
                        <a href="${DOCS_URL}/developer-intelligence" target="_blank" class="block px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-solarglyph dark:hover:text-blue-400 transition-colors">
                            <span class="block font-medium mb-0.5">Developer Intelligence</span>
                            <span class="text-xs text-gray-400 dark:text-gray-500">Explore the capabilities of Developer Intelligence</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        const links = isToolHome
            ? `<a href="#features" class="scroll-link text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Features</a>
               <a href="#pricing" class="scroll-link text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Pricing</a>
               <a href="${MAIN_SITE_URL}" class="text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Solarglyph Labs</a>
               ${docsDropdown}`
            : `<a href="${OBFUSCATE_HOME_URL}" class="text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Obfuscate Home</a>
               <a href="${MAIN_SITE_URL}" class="text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Solarglyph Labs</a>
               <a href="${STATUS_URL}" class="text-sm font-medium hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Status</a>
               ${docsDropdown}`;

        const cta = isToolHome
            ? `<a href="${APP_URL}" class="text-sm font-medium bg-solarglyph text-white px-5 py-2.5 rounded-full hover:bg-opacity-90 hover:scale-105 transition-all shadow-md">
                    Launch App
               </a>`
            : `<a href="${DISCORD_URL}" target="_blank" class="text-sm font-medium bg-solarglyph text-white px-5 py-2.5 rounded-full hover:bg-opacity-90 hover:scale-105 transition-all shadow-md flex items-center gap-2">
                    <img src="https://www.solarglyphlabs.com/images/ThirdPartyBranding/Discord-Symbol-White.png" alt="Discord" class="w-6 h-6 object-contain"> Support Discord
               </a>`;

        this.innerHTML = `
            <nav class="fixed w-full z-50 top-0 transition-all duration-300 glass-nav">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        ${logo}
                        <div class="hidden md:flex items-center space-x-8">
                            ${links}
                           <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none hover:rotate-12" aria-label="Toggle Dark Mode">
                              <i data-lucide="moon" class="w-5 h-5 dark:hidden text-gray-700"></i>
                               <i data-lucide="sun" class="w-5 h-5 hidden dark:block text-gray-300"></i>
                       </button>
                           ${cta}
                        </div>
                        <div class="md:hidden flex items-center space-x-4">
                            <button id="theme-toggle-mobile" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                <i data-lucide="moon" class="w-5 h-5 dark:hidden"></i>
                                <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
                            </button>
                        </div>
                    </div>
               </div>
           </nav>`;

        //Icons + theme toggle wiring only exist once nav is actually in the DOM
       document.dispatchEvent(new CustomEvent('site-nav-ready'));
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        const termsHref = this.getAttribute('terms-href') || TERMS_URL;
        const extraClass = this.getAttribute('extra-class') || '';

        this.innerHTML = `
            <footer class="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#050505] pt-16 pb-8 transition-colors duration-500 relative z-10 ${extraClass}">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div class="col-span-1 md:col-span-1">
                            <img class="h-8 w-auto mb-6 object-contain"
                                 src="${LOGO_URL}"
                                 alt="Solarglyph Labs Logo"
                                 onerror="this.style.display='none'; document.getElementById('footer-logo-text').classList.remove('hidden');">
                            <span id="footer-logo-text" class="font-semibold text-xl tracking-tight hidden mb-6 block">Solarglyph Labs</span>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                Luau obfuscation for Roblox developers, built by Solarglyph Labs.
                            </p>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
                            <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="${OBFUSCATE_HOME_URL}" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Obfuscator</a></li>
                                <li><a href="${APP_URL}" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Launch App</a></li>
                                <li><a href="${MAIN_SITE_URL}" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Solarglyph Labs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-4 text-gray-900 dark:text-white">Community & Legal</h4>
                            <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="${DISCORD_URL}" target="_blank" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Discord Server</a></li>
                                <li><a href="${STATUS_URL}" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Status</a></li>
                                <li><a href="${DOCS_URL}" target="_blank" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Documentation</a></li>
                                <li><a href="${termsHref}" class="hover:text-solarglyph dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center">
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            &copy; <span id="year"></span> Solarglyph Labs. All rights reserved.
                        </p>
                        <div class="flex space-x-6 mt-4 md:mt-0 text-gray-400">
                            <a href="${DISCORD_URL}" target="_blank" class="hover:text-solarglyph dark:hover:text-blue-400 transition-transform hover:scale-110"><img src="https://www.solarglyphlabs.com/images/ThirdPartyBranding/Discord-Symbol-White.png" alt="Discord" class="w-6 h-6 object-contain"></a>
                            <a href="#" class="hover:text-solarglyph dark:hover:text-blue-400 transition-transform hover:scale-110"><i data-lucide="github" class="w-5 h-5"></i></a>
                        </div>
                    </div>
                </div>
            </footer>`;

        document.dispatchEvent(new CustomEvent('site-footer-ready'));
    }
}

customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
