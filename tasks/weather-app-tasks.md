# Backlog de Tarefas — Weather App

As tarefas foram divididas em slices coesos, com no máximo dois arquivos prováveis por tarefa. A ordem das entregas indica a sequência de implementação; IDs são identificadores estáveis e não representam prioridade numérica. Os critérios referenciam os IDs `AC-*` e `NFR-*` da spec.

## Rastreabilidade de Requisitos Funcionais

A tabela lista tarefas de implementação e integração; tarefas exclusivamente de teste não são tratadas como implementação.

| Requisito da spec | Tarefas implementadoras | Cobertura |
|---|---|---|
| FR-01 — Buscar e selecionar cidade | T-08, T-12, T-13, T-15, T-16 | Coberto: geocoding, estado de busca, seleção explícita, resultados/desambiguação e ligação ao App. |
| FR-02 — Consultar condições atuais | T-01, T-04, T-06, T-10, T-17, T-20, T-24 | Coberto: contrato, horário/localidade, código meteorológico, acesso ao forecast, apresentação, unidade e integração de estado. |
| FR-03 — Consultar previsão diária de cinco datas | T-01, T-04, T-06, T-10, T-18, T-21, T-24 | Coberto: modelo de cinco datas, fuso local, mapeamento, apresentação mínima/máxima/condição e integração. |
| FR-04 — Alternar unidade de temperatura | T-02, T-19, T-20, T-21, T-42 | Coberto: conversão pura, controle, derivação nos componentes e estado/reset no App. |
| FR-05 — Tratar estados de busca e consulta | T-08, T-10, T-12, T-13, T-22, T-23, T-24 | Coberto: vazio, zero resultados, erro/timeout, retry manual, dados parciais e renderização dos estados. |

Todos os requisitos funcionais FR-01 a FR-05 têm pelo menos uma tarefa de implementação correspondente.

## Prioridade, tamanho e sequência de entrega

Prioridade: **P0** é necessária para o MVP funcional; **P1** é gate de prontidão antes do lançamento público; **P2** seria melhoria opcional fora do escopo aprovado, portanto não há tarefas P2 neste backlog. Tamanho: **P** é uma mudança/teste local; **M** envolve vários comportamentos ou integração entre módulos; **G** depende de coordenação externa ou decisão de ferramenta.

| Tarefa | Prioridade | Tamanho |
|---|---:|---:|
| T-01 | P0 | M |
| T-02 | P0 | P |
| T-03 | P0 | P |
| T-04 | P0 | M |
| T-05 | P0 | P |
| T-06 | P0 | P |
| T-07 | P0 | P |
| T-08 | P0 | M |
| T-09 | P0 | M |
| T-10 | P0 | M |
| T-11 | P0 | M |
| T-12 | P0 | M |
| T-13 | P0 | M |
| T-14 | P0 | M |
| T-15 | P0 | M |
| T-16 | P0 | M |
| T-17 | P0 | M |
| T-18 | P0 | M |
| T-19 | P0 | P |
| T-20 | P0 | P |
| T-21 | P0 | P |
| T-22 | P0 | P |
| T-23 | P0 | P |
| T-24 | P0 | M |
| T-25 | P0 | P |
| T-26 | P0 | M |
| T-27 | P1 | M |
| T-28 | P1 | M |
| T-29 | P0 | M |
| T-30 | P0 | M |
| T-31 | P0 | P |
| T-32 | P0 | M |
| T-33 | P0 | M |
| T-34 | P0 | M |
| T-35 | P0 | M |
| T-36 | P1 | M |
| T-37 | P1 | P |
| T-38 | P1 | G |
| T-39 | P1 | P |
| T-40 | P1 | M |
| T-41 | P1 | M |
| T-42 | P0 | M |
| T-43 | P0 | P |

### Fatias verticais sugeridas

1. **MVP visível — buscar cidade e consultar o tempo:** implementar `T-01`, `T-02`, `T-04`, `T-06`, `T-08`, `T-10`, `T-12`, `T-13`, `T-15`, `T-16`, `T-17`, `T-18`, `T-19`, `T-20`, `T-21`, `T-22`, `T-23`, `T-24`, `T-25`, `T-26` e `T-42`. Executar os testes unitários/componentes correspondentes (`T-03`, `T-05`, `T-07`, `T-09`, `T-11`, `T-14`, `T-29`, `T-30`, `T-31`, `T-32`, `T-43`) junto com cada incremento; isso entrega o fluxo completo de busca, seleção, clima atual, cinco dias, unidade e recuperação sem esperar o backlog inteiro.
2. **Validar fluxos em navegador e mobile:** concluir `T-36` e `T-37`, depois executar `T-33`, `T-34` e `T-35` com APIs interceptadas e viewport móvel; esta fatia verifica o fluxo já visível, não introduz outra camada de produto.
3. **Prontidão de produção:** concluir `T-27` e `T-28` (acessibilidade), então `T-38`; após aprovação, executar `T-39`, `T-40` e `T-41` para Core Web Vitals e disponibilidade.

## Entrega 1 — Tipos

### T-01 — Definir contratos TypeScript do domínio

- **Descrição:** alinhar o modelo compartilhado com o plano e a spec, mantendo Celsius como representação canônica e `null` para valores ausentes.
- **Rastreabilidade:** FR-02, FR-03; AC-02.1, AC-03.1, AC-03.2, AC-03.3.
- **Critérios de aceite:** `src/types/weather.ts` exporta os cinco tipos listados; `City` contém id, nome, região/país anuláveis e coordenadas; condições atuais e previsões usam temperaturas Celsius anuláveis; `WeatherSnapshot.days` é uma tupla de cinco `ForecastDay`; `pnpm build` aceita os contratos sem casts para tipos da API.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data.

## Entrega 2 — Funções puras

### T-02 — Implementar conversão de temperatura

- **Descrição:** implementar uma função pura para converter Celsius para a unidade de apresentação e aplicar o arredondamento da spec.
- **Rastreabilidade:** FR-04; AC-04.1, AC-04.2, AC-04.3.
- **Critérios de aceite:** para entrada em Celsius retorna o mesmo valor arredondado; para Fahrenheit aplica `(C * 9 / 5) + 32`; arredonda ao inteiro mais próximo com empates afastados de zero; `null` permanece `null`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data.

### T-04 — Implementar formatação local de datas e horários

- **Descrição:** formatar datas e horários para pt-BR e comparar o horário de referência com a hora atual.
- **Rastreabilidade:** AC-02.1, AC-02.2, AC-03.1; NFR-01, NFR-06.
- **Critérios de aceite:** datas/horários usam `pt-BR` e o fuso recebido; a função de atualidade retorna desatualizado apenas quando a idade excede duas horas; cálculos não dependem do fuso do host.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/format.ts`.
- **Tipo:** Data.

### T-06 — Implementar rótulos de códigos meteorológicos

- **Descrição:** mapear códigos WMO recebidos da API para descrições pt-BR.
- **Rastreabilidade:** AC-02.1, AC-03.2; NFR-01.
- **Critérios de aceite:** código `0` retorna `Céu limpo`, `3` retorna `Nublado`, `61` retorna `Chuva fraca`; código não mapeado retorna `Condição desconhecida` sem lançar erro.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data.

## Entrega 3 — Services

### T-08 — Implementar serviço de geocoding

- **Descrição:** buscar cidades e mapear candidatos da resposta externa para `City`.
- **Rastreabilidade:** FR-01, FR-05; AC-01.1, AC-01.2, AC-01.3, AC-05.1, AC-05.2.
- **Critérios de aceite:** busca por `São Paulo` envia `name=S%C3%A3o%20Paulo`; termo vazio não chama `fetch`; resultado é mapeado para `City` com id, nome, região, país e coordenadas; HTTP 200 sem resultados retorna lista vazia; status não-2xx lança erro tipado.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data.

### T-10 — Implementar serviço de forecast

- **Descrição:** consultar clima atual e cinco datas locais e mapear os dados para o modelo de domínio.
- **Rastreabilidade:** FR-02, FR-03, FR-05; AC-02.1, AC-02.2, AC-03.1, AC-03.2, AC-03.3, AC-05.3, AC-05.4, AC-05.6.
- **Critérios de aceite:** request usa latitude/longitude do `City`, `current=temperature_2m,weather_code`, `daily=temperature_2m_min,temperature_2m_max,weather_code`, `forecast_days=5`, `timezone=auto` e Celsius; gera hoje e quatro datas locais seguintes; campos/dias sem valores viram `null`; cada request aborta em 10 s.
- **Dependências:** T-01, T-08.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data.

## Entrega 4 — Hook

### T-12 — Implementar máquina de estados do hook

- **Descrição:** implementar os estados `idle`, `loading`, `success`, `error` e `empty`, com operação e razão do estado vazio.
- **Rastreabilidade:** FR-01, FR-05; AC-05.1, AC-05.2, AC-05.3, AC-05.4.
- **Critérios de aceite:** input vazio resulta em `empty/query` sem serviço; busca válida resulta em `loading/search`; zero resultados resulta em `empty/no-results`; seleção resulta em `loading/weather`; sucesso e falha resultam em `success` e `error`; campos incompatíveis são limpos em cada transição.
- **Dependências:** T-01, T-08, T-10.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** UI.

### T-13 — Implementar seleção, retry e proteção contra concorrência

- **Descrição:** completar a orquestração do hook para seleção explícita, repetição manual e respostas obsoletas.
- **Rastreabilidade:** FR-01, FR-05; AC-01.4, AC-05.5, AC-05.7.
- **Critérios de aceite:** nenhum forecast ocorre antes da seleção explícita; um acionamento de retry gera exatamente uma chamada da operação que falhou; se busca B termina antes da busca A, a resposta de A é descartada e B permanece selecionada.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** UI.

## Entrega 5 — Componentes

### T-15 — Apresentar resultados de busca

- **Descrição:** atualizar `SearchBar` para apresentar candidatos e permitir seleção explícita.
- **Rastreabilidade:** FR-01; AC-01.2, AC-01.3.
- **Critérios de aceite:** cada opção renderizada mostra nome e região/país presentes; para homônimos indistinguíveis textualmente mostra latitude/longitude; selecionar uma opção chama o callback uma vez com o `City` correspondente.
- **Dependências:** T-01, T-12.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Tipo:** UI.

### T-17 — Apresentar clima atual

- **Descrição:** atualizar o componente de clima atual com os campos mínimos e o horário da fonte.
- **Rastreabilidade:** FR-02; AC-02.1, AC-02.2; NFR-06.
- **Critérios de aceite:** fixture de temperatura `22.4` e código `2` renderiza cidade, temperatura arredondada, rótulo da condição e horário local; idade de 2 h não mostra aviso e idade acima de 2 h mostra aviso.
- **Dependências:** T-01, T-04, T-06, T-12.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI.

### T-18 — Apresentar cartões da previsão diária

- **Descrição:** atualizar `ForecastCard` e `ForecastList` para mínima, máxima e condição por data.
- **Rastreabilidade:** FR-03; AC-03.1, AC-03.2, AC-03.3.
- **Critérios de aceite:** fixture de cinco datas produz exatamente cinco cartões em ordem; cada cartão associa mínima, máxima e rótulo WMO à mesma data; `null` exibe “Indisponível” e nunca `0`.
- **Dependências:** T-01, T-04, T-06, T-12.
- **Arquivos prováveis:** `src/components/ForecastCard.tsx`, `src/components/ForecastList.tsx`.
- **Tipo:** UI.

### T-19 — Implementar controle de unidade

- **Descrição:** apresentar o controle de seleção Celsius/Fahrenheit sem guardar estado da página.
- **Rastreabilidade:** FR-04.
- **Critérios de aceite:** `UnitToggle` recebe a unidade e emite `onChange` com a opção escolhida uma vez por interação; não importa API nem serviço.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI.

### T-20 — Aplicar conversão ao clima atual

- **Descrição:** derivar valores de temperatura na renderização do componente atual, sem alterar dados ou fazer request.
- **Rastreabilidade:** FR-04; AC-04.2, AC-04.3.
- **Critérios de aceite:** para `0 °C`, renderiza `0°` em Celsius e `32°` em Fahrenheit; ao receber novamente a unidade Celsius, renderiza `0°` a partir do valor original.
- **Dependências:** T-02, T-17, T-19.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI.

### T-21 — Aplicar conversão aos cartões de previsão

- **Descrição:** derivar mínima e máxima em Celsius/Fahrenheit durante a renderização dos cartões.
- **Rastreabilidade:** FR-04; AC-04.2, AC-04.3.
- **Critérios de aceite:** fixture com mínima `0 °C` e máxima `10 °C` renderiza `32°/50°` em Fahrenheit e `0°/10°` ao receber Celsius novamente, usando os valores originais.
- **Dependências:** T-02, T-18, T-19.
- **Arquivos prováveis:** `src/components/ForecastCard.tsx`.
- **Tipo:** UI.

### T-22 — Apresentar estados de carregamento e vazio

- **Descrição:** implementar estados visuais para loading e input vazio/zero resultados.
- **Rastreabilidade:** FR-05; AC-05.1, AC-05.2.
- **Critérios de aceite:** loading renderiza conteúdo acessível com `role=status`; `empty/query` solicita nome de cidade; `empty/no-results` mostra mensagem de nenhum resultado e o termo pesquisado.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`, `src/components/states/EmptyState.tsx`.
- **Tipo:** UI.

### T-23 — Apresentar erros e retry

- **Descrição:** implementar estado visual de falha recuperável com ação de retry.
- **Rastreabilidade:** FR-05; AC-05.3, AC-05.4, AC-05.5; NFR-03.
- **Critérios de aceite:** erro HTTP/rede e timeout exibem mensagens pt-BR diferentes; conteúdo tem `role=alert`; botão “Tentar novamente” é acessível por teclado e aciona callback uma vez; stack/status interno não aparece na UI.
- **Dependências:** T-12, T-13.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Tipo:** UI.

### T-27 — Tornar busca e unidade acessíveis

- **Descrição:** garantir nomes acessíveis, estados e operação por teclado nos controles de busca e unidade.
- **Rastreabilidade:** NFR-03.
- **Critérios de aceite:** busca, seleção e unidade são operáveis por teclado com foco visível; resultados têm roles/names acessíveis; o toggle expõe o valor selecionado por `aria-pressed`; axe não reporta violações críticas/serious nessas telas.
- **Dependências:** T-15, T-19.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`, `src/components/UnitToggle.tsx`.
- **Tipo:** UI.

### T-28 — Tornar dados meteorológicos semanticamente acessíveis

- **Descrição:** adicionar semântica e rótulos acessíveis para condições atuais e cartões de previsão.
- **Rastreabilidade:** NFR-03.
- **Critérios de aceite:** árvore acessível expõe cidade, cada data, mínima/máxima, unidade e condição em ordem; ícones decorativos são ocultos ou têm nome; contraste atende WCAG 2.2 AA; axe não reporta violações críticas/serious.
- **Dependências:** T-17, T-18.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/components/ForecastCard.tsx`.
- **Tipo:** UI.

## Entrega 6 — Integração

### T-16 — Conectar busca e seleção na aplicação

- **Descrição:** ligar callbacks de busca/seleção de `SearchBar` ao hook sem selecionar resultado automaticamente.
- **Rastreabilidade:** FR-01; AC-01.2, AC-01.4.
- **Critérios de aceite:** enviar termo válido chama busca uma vez; forecast tem zero chamadas antes da seleção; selecionar a segunda opção chama forecast uma vez com as coordenadas da segunda opção.
- **Dependências:** T-12, T-15.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-24 — Conectar estados do hook à página

- **Descrição:** renderizar loading, vazio, erro ou resultado conforme o estado do hook.
- **Rastreabilidade:** FR-05; AC-05.1 a AC-05.7.
- **Critérios de aceite:** `idle` mostra EmptyState inicial; `loading` mostra LoadingState; `empty` mostra EmptyState; `error` mostra ErrorState; `success` mostra clima e forecast; iniciar nova cidade remove snapshot anterior; retry chama somente a operação registrada no estado.
- **Dependências:** T-12, T-13, T-16, T-17, T-18, T-20, T-21, T-22, T-23.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-42 — Integrar estado de unidade no App

- **Descrição:** manter unidade em estado local e passá-la aos controles e componentes meteorológicos.
- **Rastreabilidade:** FR-04; AC-04.1, AC-04.2, AC-04.3, AC-04.4; NFR-07.
- **Critérios de aceite:** App inicia em Celsius; mudança pelo `UnitToggle` atualiza clima atual e forecast; recarga volta para Celsius; alternar unidade não chama serviço.
- **Dependências:** T-16, T-17, T-18, T-19, T-20, T-21, T-24.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-25 — Manter atribuição visível à Open-Meteo

- **Descrição:** apresentar link e atribuição da fonte no layout da aplicação.
- **Rastreabilidade:** NFR-09.
- **Critérios de aceite:** rodapé contém link visível com texto “Open-Meteo” e `href=https://open-meteo.com/`; texto de atribuição aprovado está registrado no checklist de release.
- **Dependências:** T-16, T-24, T-42; confirmação externa dos termos de atribuição.
- **Arquivos prováveis:** `src/App.tsx`, `docs/release-checklist.md`.
- **Tipo:** UI.

### T-26 — Ajustar layout responsivo

- **Descrição:** adaptar o layout integrado aos limites de tela definidos na spec.
- **Rastreabilidade:** NFR-02.
- **Critérios de aceite:** em viewports de 320 px, 360 x 800 px, 768 px e 1920 px, a largura de scroll não excede a viewport e busca, unidade, dados e retry permanecem visíveis sem sobreposição.
- **Dependências:** T-16, T-18, T-21, T-24, T-25, T-42.
- **Arquivos prováveis:** `src/App.tsx`, `src/styles/index.css`.
- **Tipo:** UI.

## Entrega 7 — Testes

### T-03 — Testar conversão de temperatura

- **Descrição:** testar conversão e arredondamento sem rede ou dependência de UI.
- **Rastreabilidade:** AC-04.1, AC-04.2, AC-04.3.
- **Critérios de aceite:** Vitest verifica `0 °C -> 32 °F`, `-40 °C -> -40 °F`, empates positivos e negativos conforme a regra, `null -> null` e a sequência `0 °C -> 32 °F -> 0 °C` usando sempre o valor original.
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test.

### T-05 — Testar formatação local

- **Descrição:** testar formatação de datas, horários e identificação de dados com mais de duas horas.
- **Rastreabilidade:** AC-02.1, AC-02.2, AC-03.1; NFR-01, NFR-06.
- **Critérios de aceite:** Vitest fixa relógio e fuso; verifica conversão de data ao formatar em `America/Sao_Paulo`; verifica frescor em 1 h 59 min, exatamente 2 h e 2 h 1 min com resultados `false`, `false` e `true`.
- **Dependências:** T-04.
- **Arquivos prováveis:** `tests/unit/format.test.ts`.
- **Tipo:** Test.

### T-07 — Testar mapeamento de códigos WMO

- **Descrição:** validar códigos conhecidos e fallback para código desconhecido.
- **Rastreabilidade:** AC-02.1, AC-03.2.
- **Critérios de aceite:** Vitest afirma os rótulos exatos para códigos `0`, `3` e `61`, e afirma o fallback `Condição desconhecida` para `123456`.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`.
- **Tipo:** Test.

### T-09 — Testar serviço de geocoding

- **Descrição:** verificar request, mapeamento de cidades e resultado vazio usando `fetch` mockado.
- **Rastreabilidade:** AC-01.1, AC-01.2, AC-01.3, AC-05.1, AC-05.2.
- **Critérios de aceite:** testes verificam URL/parâmetros para termo Unicode, mapeamento de campos presentes/ausentes, lista vazia em 200, erro tipado em 4xx/5xx e zero chamadas para termo vazio.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test.

### T-11 — Testar serviço de forecast

- **Descrição:** testar parâmetros, mapeamento, dados parciais e falhas do forecast com respostas controladas.
- **Rastreabilidade:** AC-02.1, AC-03.1, AC-03.2, AC-03.3, AC-05.3, AC-05.4, AC-05.6.
- **Critérios de aceite:** com relógio/fuso fixos e payload controlado, Vitest verifica cinco datas em ordem, alinhamento por data, campos ausentes `null`, resposta sem estrutura utilizável, HTTP, rede e abort em 10 s; `fetch` é sempre mockado.
- **Dependências:** T-09, T-10.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test.

### T-14 — Testar máquina de estados e concorrência

- **Descrição:** testar o hook sem renderizar componentes de apresentação, mockando o serviço.
- **Rastreabilidade:** AC-01.4, AC-05.1, AC-05.2, AC-05.3, AC-05.4, AC-05.5, AC-05.7.
- **Critérios de aceite:** testes afirmam `idle`, `loading`, `success`, `error` e `empty`; validam `emptyReason` para input vazio/zero resultados, zero forecast antes da seleção, uma chamada por retry e descarte da resposta A quando B já concluiu.
- **Dependências:** T-12, T-13.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Tipo:** Test.

### T-29 — Testar busca e seleção na UI

- **Descrição:** testar interação e acessibilidade da busca e dos resultados.
- **Rastreabilidade:** AC-01.1, AC-01.2, AC-01.3; NFR-03.
- **Critérios de aceite:** Testing Library verifica termo Unicode passado ao callback, opções com nome e geografia, coordenadas para homônimos indistinguíveis, callback único para a opção selecionada e navegação/seleção por teclado.
- **Dependências:** T-15, T-27.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`.
- **Tipo:** Test.

### T-30 — Testar visualização atual e previsão

- **Descrição:** testar componentes de clima e previsão com dados completos, parciais e unidades variadas.
- **Rastreabilidade:** AC-02.1, AC-02.2, AC-03.1, AC-03.2, AC-03.3, AC-04.2, AC-04.3; NFR-03.
- **Critérios de aceite:** fixtures afirmam textos/valores exatos; atualidade testa 2 h versus 2 h 1 min; previsão rende cinco datas na ordem; `null` rende “Indisponível”; `0 °C` rende `32°` e retorna a `0°`; árvore acessível associa valor e unidade à cidade/data.
- **Dependências:** T-17, T-18, T-20, T-21, T-28.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`, `tests/unit/ForecastList.test.tsx`.
- **Tipo:** Test.

### T-31 — Testar alternância de unidade

- **Descrição:** testar a interação e o estado acessível do controle de unidade.
- **Rastreabilidade:** FR-04; AC-04.2.
- **Critérios de aceite:** Testing Library verifica Celsius selecionado inicialmente, clique em Fahrenheit chama `onChange('fahrenheit')` uma vez, `aria-pressed` muda para o botão Fahrenheit e teclado alterna a seleção.
- **Dependências:** T-19.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`.
- **Tipo:** Test.

### T-32 — Testar estados da página

- **Descrição:** testar a integração dos estados do hook com a página.
- **Rastreabilidade:** AC-05.1, AC-05.2, AC-05.3, AC-05.4, AC-05.5, AC-05.6, AC-05.7.
- **Critérios de aceite:** Testing Library verifica que o estado do hook renderiza o componente esperado na página; retry encaminha uma chamada ao hook; resposta parcial mostra valor válido e “Indisponível”; mudança de cidade remove dados antigos.
- **Dependências:** T-22, T-23, T-24.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Tipo:** Test.

### T-43 — Testar componentes de loading, erro e vazio

- **Descrição:** testar diretamente os componentes de estado, sem rede e sem montar a aplicação inteira.
- **Rastreabilidade:** FR-05; AC-05.1, AC-05.2, AC-05.3, AC-05.4, AC-05.5; NFR-03.
- **Critérios de aceite:** Testing Library renderiza `LoadingState` e localiza status por role; `EmptyState` mostra mensagens distintas para input vazio e zero resultados; `ErrorState` expõe erro via `role=alert` e botão “Tentar novamente”; clique e teclado disparam retry uma vez; conteúdo interno da resposta HTTP não aparece.
- **Dependências:** T-22, T-23.
- **Arquivos prováveis:** `tests/unit/weatherStates.test.tsx`.
- **Tipo:** Test.

### T-36 — Configurar projetos Playwright para a matriz de navegadores

- **Descrição:** definir projetos de execução compatíveis com a matriz de NFR-08.
- **Rastreabilidade:** NFR-08.
- **Critérios de aceite:** configuração define projetos desktop Chromium, Firefox e WebKit e projetos mobile Safari/Chrome; checklist registra browser, versão e resultado para as duas versões estáveis mais recentes de Chrome, Firefox, Edge e Safari desktop, além de Safari iOS e Chrome Android.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `playwright.config.ts`, `docs/release-checklist.md`.
- **Tipo:** Test.

### T-37 — Instalar navegadores da matriz no CI

- **Descrição:** alinhar a instalação de browsers do workflow aos projetos Playwright configurados.
- **Rastreabilidade:** NFR-08.
- **Critérios de aceite:** workflow instala Chromium, Firefox e WebKit antes de `pnpm test:e2e`; job fica verde em PR somente quando os projetos Playwright configurados passam.
- **Dependências:** T-36.
- **Arquivos prováveis:** `.github/workflows/ci.yml`.
- **Tipo:** Infra.

### T-33 — Testar jornada principal em desktop

- **Descrição:** automatizar a busca, seleção e consulta meteorológica ponta a ponta.
- **Rastreabilidade:** AC-01.1 a AC-04.4.
- **Critérios de aceite:** com APIs interceptadas, Playwright verifica uma busca geocoding, zero forecast antes da seleção, um forecast após selecionar a cidade correta, clima e cinco datas correspondentes; alternar unidade não aumenta a contagem de requests; após recarregar, Celsius está selecionado.
- **Dependências:** T-09, T-11, T-14, T-16, T-24, T-25, T-29, T-30, T-31, T-36, T-37, T-42.
- **Arquivos prováveis:** `tests/e2e/weather-happy-path.spec.ts`.
- **Tipo:** Test.

### T-34 — Testar recuperação E2E de erros

- **Descrição:** cobrir falhas recuperáveis e estados vazios no navegador.
- **Rastreabilidade:** AC-05.1 a AC-05.7.
- **Critérios de aceite:** com APIs interceptadas, Playwright verifica zero request para input vazio; zero resultados distinto de HTTP; timeout após 10 s; um request adicional por retry; resposta parcial marcada; a resposta A é atrasada até B concluir e não substitui os dados da cidade B.
- **Dependências:** T-09, T-11, T-14, T-23, T-24, T-32, T-36, T-37.
- **Arquivos prováveis:** `tests/e2e/weather-error-recovery.spec.ts`.
- **Tipo:** Test.

### T-35 — Testar viewport móvel e teclado

- **Descrição:** validar os fluxos críticos em tela móvel e uma jornada acessível por teclado.
- **Rastreabilidade:** NFR-02, NFR-03.
- **Critérios de aceite:** em 360 x 800 px e 320 px, Playwright completa por toque o fluxo busca -> selecionar cidade -> clima atual -> cinco datas -> alternar unidade; afirma presença da cidade/temperaturas atuais e dos cinco cartões; `scrollWidth <= clientWidth`; em desktop, Tab/Enter completam busca, seleção, retry e unidade.
- **Dependências:** T-26, T-27, T-28, T-33, T-36, T-37.
- **Arquivos prováveis:** `tests/e2e/weather-mobile.spec.ts`.
- **Tipo:** Test.

## Entrega 8 — Hardening

### T-38 — Aprovar limites e ferramenta de observabilidade

- **Descrição:** registrar decisões de produto/operação sobre frescor, desempenho, disponibilidade, privacidade e ferramenta de medição.
- **Rastreabilidade:** NFR-04, NFR-05, NFR-06, NFR-09.
- **Critérios de aceite:** checklist registra aprovação, responsável e data para frescor de 2 h, LCP <= 2,5 s, INP <= 200 ms, CLS <= 0,1, disponibilidade 99,5%, denominador/janela, URL, ferramenta RUM/uptime e política de dados.
- **Dependências:** decisão externa de produto/operação.
- **Arquivos prováveis:** `plans/weather-app-plan.md`, `docs/release-checklist.md`.
- **Tipo:** Infra.

### T-39 — Adicionar dependência aprovada de Web Vitals

- **Descrição:** adicionar somente a dependência de coleta escolhida em T-38.
- **Rastreabilidade:** NFR-04.
- **Critérios de aceite:** pacote e versão aprovados aparecem em `package.json` e `pnpm-lock.yaml`; `pnpm install --frozen-lockfile` termina com exit code 0.
- **Dependências:** T-38.
- **Arquivos prováveis:** `package.json`, `pnpm-lock.yaml`.
- **Tipo:** Infra.

### T-40 — Instrumentar coleta de Core Web Vitals

- **Descrição:** inicializar a ferramenta aprovada no ponto de entrada sem bloquear renderização ou enviar dados não autorizados.
- **Rastreabilidade:** NFR-04.
- **Critérios de aceite:** evento de teste confirma envio de LCP, INP e CLS ao destino aprovado; relatório permite consultar p75 em 28 dias; bloqueio do endpoint de métricas não impede renderização; payload não contém dados pessoais não aprovados.
- **Dependências:** T-39.
- **Arquivos prováveis:** `src/main.tsx`.
- **Tipo:** Infra.

### T-41 — Configurar verificação sintética de disponibilidade

- **Descrição:** monitorar a URL de GitHub Pages conforme alvo e ferramenta aprovados.
- **Rastreabilidade:** NFR-05.
- **Critérios de aceite:** monitor usa URL configurada; cada execução registra sucesso/falha do carregamento; relatório calcula disponibilidade mensal sobre janela/denominador aprovados em T-38 e gera alerta ao cruzar o SLO de 99,5%.
- **Dependências:** T-38; publicação do site concluída.
- **Arquivos prováveis:** novo workflow de monitoramento ou configuração da ferramenta de uptime escolhida.
- **Tipo:** Infra.