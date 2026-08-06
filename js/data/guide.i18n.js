/* ==========================================================================
   i18n data — Guide (about.html)
   EN lives in the HTML markup itself (auto-captured by i18n.js at load).
   This file only carries the Portuguese translations + page <title>/<meta>
   description strings, for about.html.
   ========================================================================== */

window.MUITTO_META = {
    en: { title: "About — MUITTO", desc: "What MUITTO is, why it's called that, and how the test runner works under the hood." },
    pt: { title: "Sobre — MUITTO", desc: "O que é o MUITTO, por que esse nome, e como o test runner funciona por debaixo dos panos." }
  };

window.MUITTO_PT = {
    "nav.home": "Início", "nav.about": "Guia", "nav.api": "API",
    "nav.releases": "Releases", "nav.latest": "atual", "nav.allReleases": "Ver todas →",
    "nav.releaseDesc": "Última versão de correções.",
    "nav.viewChangelog": "Ver changelog →",
    "nav.search": "Buscar", "nav.searchPlaceholder": "Buscar na documentação...",

    "about.kicker": "A filosofia",
    "about.title": "Construído sem dependências. Nem este site.",
    "about.sub": "Um test runner minimalista para TypeScript — e o raciocínio por trás dele.",
    "about.h3what": "O que é o MUITTO?",
    "about.what": "MUITTO é um test runner minimalista e sem dependências para TypeScript. Sem arquivo de config pra brigar, sem plugin pra configurar — instale, escreva um bloco <code>describe</code>/<code>it</code>, e rode. É rápido, leve e feito para ser lido — não apenas executado.",
    "about.h3why": "Por que esse nome?",
    "about.why": "\"MUITTO\" vem de <em style=\"color:var(--text);font-style:normal\">muito</em>, uma expressão brasileira que resume a filosofia inteira em uma palavra. Entregar tudo que você precisa para testar, e nada do que você não precisa. Máxima capacidade, mínimo overhead. Simples. Direto. Poderoso.",
    "about.h3how": "Como funciona por debaixo dos panos",
    "about.how1": "Não tem bundler, não tem sistema de plugins e — fora o <code>tsx</code> pra transpilar TypeScript em dev — nenhuma dependência em runtime. Quando você roda <code>muitto</code>, ele carrega a config do <code>.muittorc.json</code> / <code>package.json</code>, e então varre o projeto comparando cada caminho de arquivo contra os padrões glob configurados: um matcher escrito à mão, sem lib externa, suportando <code>**</code>, <code>*</code>, <code>?</code> e <code>{a,b}</code>.",
    "about.how2": "Cada arquivo encontrado é importado com uma query string anti-cache (<code>?t=timestamp-random</code>), pra que o watch mode sempre releia código fresco em vez de um módulo em cache. Chamar <code>describe</code>/<code>it</code> ainda não roda nada — só registra o teste num registro compartilhado, guardado via <code>Symbol.for('muitto.registry')</code> no <code>globalThis</code>, garantindo que continue sendo o mesmo array não importa como o módulo seja resolvido. Quando o arquivo termina de importar, o runner esvazia esse registro, roda os hooks e o timeout de cada teste em sequência, e reporta o resultado — antes de seguir pro próximo arquivo.",
    "about.how3": "Os arquivos rodam um depois do outro, não em paralelo — isso mantém a saída determinística e evita a complexidade de juntar resultados entre processos. Cada teste tem seu próprio timeout, protegido por uma referência real de <code>setTimeout</code> capturada antes de qualquer arquivo de teste rodar, então um teste que chama <code>useFakeTimers()</code> e esquece de restaurar não consegue desligar sem querer o timeout do próprio runner.",
    "about.how4": "Reporters são uma interface pequena de observer — <code>onStart</code>, <code>onFileStart</code>, <code>onTestEnd</code>, <code>onEnd</code> — completamente desacoplada da execução, e é por isso que <code>default</code>, <code>dot</code>, <code>verbose</code>, <code>json</code> e <code>junit</code> passam todos pelo mesmo caminho de código. Snapshots seguem a mesma abordagem chata-de-propósito: são gravados num arquivo <code>.snap</code> em JSON simples, dentro de <code>__snapshots__/</code>, ao lado do arquivo de teste, e comparados em toda execução futura — inclusive no CI.",
    "guide.install.title": "Instalação &amp; uso",
    "guide.install.sub": "Instale como dependência de desenvolvimento e rode direto pela CLI — não há passo de setup adicional.",
    "guide.install.h3install": "Instalar",
    "guide.install.c1": "// com npm",
    "guide.install.c2": "// ou direto com npx, sem instalar",
    "guide.install.h3run": "Rodar a suíte",
    "guide.install.c3": "// roda tudo",
    "guide.install.c4": "// observa mudanças",
    "guide.install.c5": "// filtra por nome",
    "guide.install.c6": "// arquivo específico",
    "guide.install.note": "A precedência de configuração é: <b>flags de CLI</b> → <b><code>.muittorc.json</code></b> → <b>chave <code>\"muitto\"</code> no <code>package.json</code></b> → padrões internos. Detalhes completos na <a href=\"api.html#config\" style=\"color:var(--accent-light)\">referência da API</a>.",

    "guide.discovery.title": "Descoberta de arquivos",
    "guide.discovery.sub": "Sem argumentos, o MUITTO varre o projeto (ignorando <code>node_modules</code>, <code>.git</code>, <code>dist</code>, <code>build</code>, <code>coverage</code>, <code>.next</code> e <code>.nuxt</code>) e casa cada caminho contra os padrões configurados.",
    "guide.discovery.c1": "// padrões padrão (personalizáveis via pattern/testMatch)",
    "guide.discovery.tip": "Use <code>--show-patterns</code> para ver exatamente quais padrões estão ativos no seu projeto.",

    "guide.writing.title": "Escrevendo testes",
    "guide.writing.sub": "A mesma forma <code>describe</code>/<code>it</code>/<code>expect</code> que você já conhece. Suítes podem se aninhar, testes podem ser async, e nada roda até o runner esvaziar o registro do arquivo.",
    "guide.writing.h3basic": "Uma suíte básica",
    "guide.writing.h3focus": "Pulando e focando testes",
    "guide.writing.focusDesc": "<code>.skip</code> reporta como pulado em vez de rodar. <code>.only</code> é exclusivo: quando existe um no arquivo, todo o resto naquele arquivo é pulado.",
    "guide.writing.h3each": "Testes parametrizados",

    "guide.mocks.title": "Mocks &amp; spies",
    "guide.mocks.sub": "Crie funções mock isoladas com <code>fn()</code>, ou espione um método existente com <code>spyOn()</code> sem perder sua implementação original.",
    "guide.mocks.c1": "// devolve a implementação original",
    "guide.mocks.more": "Todo mock registra <code>.mock.calls</code> e <code>.mock.results</code>, e pode ser resetado com <code>mockClear()</code>/<code>mockReset()</code> — veja a <a href=\"api.html#mocks\" style=\"color:var(--accent-light)\">referência completa da API</a>.",

    "guide.timers.title": "Fake timers",
    "guide.timers.sub": "Substitui <code>setTimeout</code>, <code>setInterval</code> e <code>Date</code> por versões controláveis — os timeouts internos do próprio runner continuam reais.",

    "guide.snapshots.title": "Snapshots",
    "guide.snapshots.sub": "Persistidos em <code>__snapshots__/&lt;arquivo&gt;.snap</code>, ao lado do arquivo de teste — comparam contra execuções e commits anteriores, não apenas contra a mesma execução.",
    "guide.snapshots.note": "Divergiu de propósito? Rode <code>muitto --update-snapshots</code> para regravar. Na primeira execução, o snapshot é criado automaticamente.",

    "guide.retry.title": "Retry",
    "guide.retry.sub": "Para testes que dependem de condições assíncronas instáveis (flaky). Padrões: <code>times: 3</code>, <code>delay: 100</code>ms.",

    "about.cta": "Leia a referência completa da API →",

    "footer.origin": "<b>MUITTO</b><br>Um test runner minimalista e sem dependências para TypeScript — feito para ser lido, não apenas executado.",
    "footer.project": "Projeto", "footer.docs": "Documentação",
    "footer.quickstart": "Início rápido", "footer.matchersLink": "Matchers", "footer.cliLink": "CLI",
    "footer.tagline": "Construído sem dependências. Nem este site."
  };
