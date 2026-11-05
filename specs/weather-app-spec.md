# Especificação de Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva para buscar cidades e consultar as condições meteorológicas atuais e uma previsão diária de cinco datas locais. A interface é em português do Brasil (pt-BR), usa Open-Meteo como fonte de dados e apresenta temperaturas em Celsius por padrão, com opção para Fahrenheit.

### Objetivos

- Permitir que usuários encontrem uma cidade e consultem o clima correspondente.
- Apresentar condições atuais e previsão de hoje mais os quatro dias seguintes.
- Permitir alternância de temperatura entre Celsius e Fahrenheit.
- Manter os fluxos principais utilizáveis em dispositivos móveis.

### Limites da especificação

Para tornar os fluxos testáveis, esta especificação fixa defaults de produto para conteúdo, previsão diária, precisão e timeout. Metas operacionais indicadas como propostas são critérios iniciais para validação com as partes interessadas antes do lançamento.

## Functional Requirements

- **FR-01 — Buscar e selecionar cidade:** permitir busca por nome de cidade com espaços externos ignorados e caracteres Unicode preservados. Exibir nome da cidade e, quando disponíveis, região e país; se esses campos não distinguirem homônimos, incluir coordenadas. A consulta meteorológica só começa após o usuário selecionar um resultado.
- **FR-02 — Consultar condições atuais:** após a seleção, exibir temperatura do ar, condição meteorológica, cidade e horário local de referência retornado pela Open-Meteo. Dados com mais de duas horas de idade devem ser identificados como desatualizados.
- **FR-03 — Consultar previsão diária:** exibir hoje e os quatro dias locais seguintes. Para cada data, exibir temperatura mínima, máxima e condição meteorológica.
- **FR-04 — Alternar unidade de temperatura:** iniciar cada carregamento do app em Celsius (°C); permitir alternar entre Celsius e Fahrenheit (°F). A escolha vale até o app ser recarregado e não é persistida localmente nem no servidor. Converter a partir dos valores originais e arredondar ao inteiro mais próximo, com empates afastados de zero.
- **FR-05 — Tratar estados de busca e consulta:** distinguir input vazio, ausência de resultados, erro do provedor/rede, timeout e resposta parcial. Em timeout, encerrar a espera após 10 segundos por requisição. Exibir mensagem adequada e ação para tentar novamente em falhas recuperáveis; não repetir automaticamente.

## User Stories

- **US-01:** Como Marina, profissional que se desloca diariamente, quero pesquisar minha cidade e consultar as condições atuais para me preparar antes de sair. **Requisitos:** FR-01, FR-02.
- **US-02:** Como Rafael, pessoa que planeja atividades ao ar livre, quero consultar a previsão de hoje e dos quatro dias seguintes para escolher quando realizar meus planos. **Requisito:** FR-03.
- **US-03:** Como Camila, viajante, quero distinguir e selecionar a cidade correta entre resultados com nomes iguais para consultar o clima do destino da minha viagem. **Requisito:** FR-01.
- **US-04:** Como Marina, profissional que se desloca diariamente, quero alternar a temperatura entre Celsius e Fahrenheit para interpretar os dados na unidade que prefiro. **Requisito:** FR-04.
- **US-05:** Como Camila, viajante, quero entender quando a busca ou a consulta falha e tentar novamente para continuar planejando sem confundir ausência de dados com o clima atual. **Requisito:** FR-05.

## Acceptance Criteria

### FR-01 — Buscar e selecionar cidade

- **AC-01.1 — Preservar e normalizar o termo pesquisado**
	- **Given** o campo contém um nome com acentos, espaços internos ou pontuação válida, com espaços adicionais nas extremidades
	- **When** o usuário envia a busca
	- **Then** a requisição de geocoding é feita uma vez, removendo apenas os espaços externos e preservando os demais caracteres
- **AC-01.2 — Apresentar e selecionar resultados**
	- **Given** o serviço de geocoding retorna resultados para o termo
	- **When** a busca termina
	- **Then** cada resultado mostra o nome da cidade e região e país quando disponíveis; a consulta meteorológica só ocorre após a seleção explícita
- **AC-01.3 — Distinguir resultados homônimos**
	- **Given** o serviço retorna cidades com o mesmo nome
	- **When** os resultados são exibidos
	- **Then** região e país distinguem os resultados; se ainda forem iguais ou ausentes, as coordenadas são exibidas
- **AC-01.4 — Consultar o local selecionado**
	- **Given** o usuário seleciona um dos resultados
	- **When** a consulta meteorológica é iniciada
	- **Then** ela usa a localização do resultado selecionado e a interface identifica essa cidade

### FR-02 — Consultar condições atuais

- **AC-02.1 — Exibir condições atuais**
	- **Given** a cidade selecionada tem uma resposta atual válida com temperatura, condição e horário de referência
	- **When** a consulta termina
	- **Then** a tela exibe cidade, temperatura arredondada, unidade, condição e horário local de referência
- **AC-02.2 — Identificar dados desatualizados**
	- **Given** o horário de referência retornado tem mais de duas horas em relação ao relógio de teste
	- **When** as condições são exibidas
	- **Then** a tela identifica os dados como desatualizados sem apresentá-los como atuais

### FR-03 — Consultar previsão de cinco dias

- **AC-03.1 — Exibir cinco datas locais**
	- **Given** o relógio de teste e o fuso horário da cidade estão fixados e há previsão completa
	- **When** a consulta termina
	- **Then** são exibidas exatamente cinco datas locais consecutivas, de hoje até hoje mais quatro dias, em ordem cronológica
- **AC-03.2 — Exibir campos diários**
	- **Given** cada data tem mínima, máxima e condição na resposta da fonte
	- **When** a previsão é exibida
	- **Then** cada data apresenta os três campos e a cidade selecionada
- **AC-03.3 — Marcar dia sem dados**
	- **Given** a resposta não contém previsão para uma das cinco datas
	- **When** a previsão é exibida
	- **Then** a data permanece identificada e é marcada como indisponível, sem valor inventado

### FR-04 — Alternar unidade de temperatura

- **AC-04.1 — Iniciar em Celsius**
	- **Given** o app acabou de ser carregado ou recarregado
	- **When** temperaturas são exibidas
	- **Then** todos os valores usam Celsius (°C)
- **AC-04.2 — Aplicar Fahrenheit a todos os valores**
	- **Given** temperaturas atuais e mínimas e máximas da previsão estão visíveis em Celsius
	- **When** o usuário seleciona Fahrenheit
	- **Then** todos os valores são convertidos a partir do valor original, arredondados ao inteiro mais próximo e rotulados em °F
- **AC-04.3 — Alternar sem acumular erro de arredondamento**
	- **Given** uma temperatura original de 0 °C
	- **When** o usuário alterna para Fahrenheit e retorna a Celsius
	- **Then** os valores exibidos são 32 °F e 0 °C, sem alterar cidade ou condição
- **AC-04.4 — Reiniciar preferência ao recarregar**
	- **Given** o usuário selecionou Fahrenheit
	- **When** recarrega o app
	- **Then** a unidade inicial é Celsius

### FR-05 — Comunicar falhas e ausência de resultados

- **AC-05.1 — Tratar input vazio**
	- **Given** o campo contém apenas espaços ou está vazio
	- **When** o usuário envia a busca
	- **Then** a interface solicita um nome de cidade e nenhuma requisição de geocoding é feita
- **AC-05.2 — Tratar cidade não encontrada**
	- **Given** o geocoding conclui com sucesso e retorna zero resultados
	- **When** a busca termina
	- **Then** a interface informa que nenhuma cidade foi encontrada, mantém o termo pesquisado e não inicia consulta meteorológica
- **AC-05.3 — Tratar erro de rede ou do provedor**
	- **Given** geocoding ou consulta meteorológica termina com erro antes do limite de 10 segundos
	- **When** a interface recebe o erro
	- **Then** informa que os dados não puderam ser obtidos, diferencia o erro de zero resultados e oferece ação de nova tentativa
- **AC-05.4 — Tratar timeout**
	- **Given** uma requisição não retorna em 10 segundos
	- **When** o limite é atingido
	- **Then** o carregamento termina, a interface informa timeout e oferece nova tentativa sem repetição automática
- **AC-05.5 — Executar nova tentativa**
	- **Given** a interface mostra erro recuperável para uma consulta
	- **When** o usuário aciona “Tentar novamente” uma vez
	- **Then** a mesma consulta é enviada uma vez e a interface mostra o resultado da nova resposta
- **AC-05.6 — Tratar resposta parcial**
	- **Given** a resposta contém alguns campos ou datas válidos e outros ausentes ou inválidos
	- **When** a interface exibe os dados
	- **Then** mostra os valores válidos e marca cada campo ou data ausente como indisponível, sem substituir lacunas por zero ou valores de outra consulta
- **AC-05.7 — Trocar de cidade durante uma consulta**
	- **Given** há dados de uma cidade exibidos e o usuário seleciona outra
	- **When** a nova consulta começa
	- **Then** os dados anteriores são removidos da área de resultado até a resposta da nova cidade

## Traceability Matrix

| User Story | Acceptance Criteria | Requisitos funcionais | Requisitos não-funcionais relevantes |
|---|---|---|---|
| US-01 — Marina consulta sua cidade e o clima atual | AC-01.1, AC-01.2, AC-01.4, AC-02.1, AC-02.2 | FR-01, FR-02 | NFR-01 (pt-BR e hora local), NFR-02 (responsividade), NFR-03 (acessibilidade), NFR-04 (desempenho), NFR-06 (local e atualidade), NFR-08 (compatibilidade), NFR-09 (atribuição) |
| US-02 — Rafael consulta a previsão para planejar atividade | AC-03.1, AC-03.2, AC-03.3, AC-04.1, AC-04.2 | FR-03, FR-04 | NFR-01 (datas locais e unidades), NFR-02 (responsividade), NFR-03 (acessibilidade), NFR-04 (desempenho), NFR-05 (disponibilidade), NFR-06 (integridade dos dados), NFR-08 (compatibilidade), NFR-09 (atribuição) |
| US-03 — Camila identifica e seleciona a cidade correta | AC-01.1, AC-01.2, AC-01.3, AC-01.4 | FR-01 | NFR-01 (pt-BR), NFR-02 (responsividade), NFR-03 (acessibilidade), NFR-04 (desempenho), NFR-06 (local correto), NFR-08 (compatibilidade), NFR-09 (atribuição) |
| US-04 — Marina alterna a unidade de temperatura | AC-04.1, AC-04.2, AC-04.3, AC-04.4 | FR-04 | NFR-01 (convenções locais), NFR-02 (responsividade), NFR-03 (acessibilidade), NFR-06 (consistência dos valores), NFR-08 (compatibilidade) |
| US-05 — Camila compreende e recupera falhas de busca ou consulta | AC-05.1, AC-05.2, AC-05.3, AC-05.4, AC-05.5, AC-05.6, AC-05.7 | FR-05 | NFR-02 (responsividade), NFR-03 (acessibilidade), NFR-04 (desempenho e limite de espera), NFR-05 (disponibilidade), NFR-06 (integridade), NFR-08 (compatibilidade), NFR-09 (atribuição) |

## Non-Functional Requirements

As metas quantitativas abaixo são propostas iniciais para tornar a validação possível; devem ser confirmadas com as partes interessadas e podem ser ajustadas antes do lançamento.

- **NFR-01 — Idioma e localização:** toda a interface é pt-BR. Datas seguem o calendário e o fuso horário da cidade consultada; números e unidades seguem convenções pt-BR.
- **NFR-02 — Responsividade:** suportar larguras de 320 px a 1920 px; nos fluxos principais não pode haver rolagem horizontal, conteúdo sobreposto ou controle inacessível.
- **NFR-03 — Acessibilidade:** conformidade WCAG 2.2 AA nas telas e fluxos em escopo. Validar automatizadamente e por inspeção manual: navegação completa por teclado, foco visível, nome/estado acessível dos controles e leitura coerente por leitor de tela.
- **NFR-04 — Desempenho:** no percentil 75 de sessões móveis reais, LCP <= 2,5 s, INP <= 200 ms e CLS <= 0,1 em janela móvel de 28 dias. Antes do lançamento, validar também em viewport de 360 x 800 px e perfil de rede 4G, registrando separadamente o tempo do provedor externo.
- **NFR-05 — Disponibilidade:** meta inicial de 99,5% mensal para carregamento da aplicação, medida por verificações externas. Disponibilidade da Open-Meteo é monitorada separadamente; falhas da fonte não podem impedir a apresentação do estado de erro definido em FR-05.
- **NFR-06 — Integridade e atualidade:** nunca associar dados a uma cidade diferente da selecionada. Se o horário de referência tiver mais de duas horas, identificar os dados como desatualizados.
- **NFR-07 — Acesso e armazenamento:** não exigir autenticação nem persistir dados do usuário no servidor. A unidade permanece somente na sessão e é reiniciada em Celsius na próxima sessão.
- **NFR-08 — Compatibilidade:** validar as funções principais nas duas versões estáveis mais recentes de Chrome, Firefox, Edge e Safari para desktop, Safari para iOS e Chrome para Android.
- **NFR-09 — Atribuição da fonte:** exibir atribuição visível e link para Open-Meteo conforme os termos vigentes do provedor.

## Edge Cases

- **Nome com Unicode ou pontuação:** preservar caracteres internos e codificar o termo corretamente na busca; ignorar apenas espaços externos.
- **Resultados homônimos sem metadados suficientes:** mostrar coordenadas para permitir distinção antes da seleção.
- **Geocoding sem resultados versus erro:** estado de “cidade não encontrada” apenas para resposta válida vazia; falha ou timeout deve ser apresentado como erro recuperável.
- **Dados parciais:** manter cada data identificável; marcar campos ou datas ausentes como indisponíveis, nunca como zero.
- **Mudança de cidade durante carregamento:** limpar os resultados anteriores ao iniciar a nova consulta; uma resposta tardia da consulta antiga não pode substituir a cidade atual.
- **Virada do dia ou fusos diferentes:** determinar a janela de cinco datas pelo fuso local da cidade, não pelo fuso do dispositivo.
- **Fonte lenta ou indisponível:** encerrar requisição em 10 segundos, permitir tentativa manual e não repetir automaticamente.

## Assumptions

- A busca cobre cidades disponíveis no geocoding da Open-Meteo; não cobre localização automática nem códigos postais.
- A previsão é diária e apresenta mínima, máxima e condição para hoje e os quatro dias seguintes no fuso local.
- As condições atuais mínimas são temperatura do ar e condição meteorológica; outros indicadores não são necessários para o lançamento inicial.
- Temperaturas são arredondadas ao inteiro mais próximo, com empates afastados de zero; conversões usam o valor original, não o valor arredondado exibido.
- A unidade é temporária por sessão; uma nova sessão começa em Celsius.
- O produto é web responsivo, em pt-BR, sem autenticação e sem persistência de dados do usuário no servidor.
- Os alvos de desempenho e disponibilidade são propostas iniciais de lançamento e devem ser aprovados pelos responsáveis de produto e operação.

## Risks

- **Indisponibilidade ou mudança na Open-Meteo (média/alta):** consultas falham ou dados mudam. Mitigar validando termos, cobertura e limites; monitorar falhas; manter estados de erro e atribuição compatíveis com o provedor.
- **Geocoding ambíguo ou sem cobertura (média/alta):** usuário escolhe local errado ou não encontra uma cidade. Mitigar exibindo região, país e coordenadas quando necessário e testando homônimos.
- **Dados antigos (média/alta):** informação pode ser confundida com observação em tempo real. Mitigar exibir horário local de referência e marcar dados com mais de duas horas.
- **Metas operacionais não aprovadas (média/média):** metas iniciais podem não atender ao negócio. Mitigar obter aprovação de produto e operação antes do lançamento e monitorá-las em produção.

## Out of Scope

- Aplicativos nativos para iOS ou Android.
- Cadastro, login, contas ou sincronização entre dispositivos.
- Persistência de perfil ou histórico no servidor.
- Localização automática do dispositivo.
- Histórico de buscas, cidades favoritas ou comparação entre cidades.
- Alertas meteorológicos ou notificações.
- Funcionamento offline como requisito garantido.
- Idiomas de interface além de pt-BR.
- Alternância de unidades além da temperatura.
- Campos meteorológicos adicionais além dos mínimos que venham a ser confirmados.

## Open Questions

1. Quais regiões geográficas e segmentos de usuário devem ser prioridade para validar cobertura e personas?
2. Produto e operação aprovam os limites iniciais de dados (2 h), desempenho (LCP/INP/CLS) e disponibilidade (99,5%)?
3. Quais termos de atribuição e condições de uso vigentes da Open-Meteo devem constar na interface antes do lançamento?