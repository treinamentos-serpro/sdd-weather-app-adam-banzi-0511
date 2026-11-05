# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação para consulta de informações meteorológicas. O usuário deve conseguir localizar uma cidade, consultar as condições atuais e a previsão para os próximos cinco dias, escolhendo entre Celsius e Fahrenheit. A aplicação também deve ser utilizável em dispositivos móveis.

O briefing define as capacidades principais, mas ainda não especifica público-alvo, localização automática, nível de detalhe da previsão nem critérios mensuráveis de qualidade.

## Decisões

- **Fonte de dados — Open-Meteo, sem API key.** Justificativa: usar a fonte definida para o produto sem exigir gestão de chave de API. Resolve a escolha do provedor; requisitos de atualização, disponibilidade e atribuição ainda precisam ser definidos.
- **Período da previsão — hoje mais os quatro dias seguintes.** Justificativa: explicitar como a janela de cinco dias é contada. Resolve se o dia atual está incluído; o nível de detalhe diário ou horário permanece em aberto.
- **Unidade padrão — Celsius (°C).** Justificativa: estabelecer uma apresentação inicial consistente com o idioma da interface. Resolve qual unidade mostrar por padrão; persistência da preferência e unidades de outras medidas permanecem em aberto.
- **Autenticação e persistência — sem autenticação e sem persistência de dados no servidor.** Justificativa: manter o acesso direto e não depender de contas ou armazenamento de dados de usuário no servidor. Resolve se haverá login e armazenamento associado a contas; eventual persistência local de preferências ainda precisa ser definida.
- **Idioma da interface — português do Brasil (pt-BR).** Justificativa: definir a localização inicial da experiência. Resolve o idioma da UI; público-alvo e regiões atendidas ainda precisam ser confirmados.

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que o usuário pesquise uma cidade pelo nome e selecione o local desejado quando houver mais de um resultado compatível.
- **RF-02 — Consultar clima atual:** após selecionar uma cidade, exibir as condições meteorológicas atuais para esse local.
- **RF-03 — Consultar previsão:** exibir a previsão de hoje e dos quatro dias seguintes.
- **RF-04 — Alternar unidades:** permitir alternar a exibição de temperatura entre Celsius (°C) e Fahrenheit (°F).
- **RF-05 — Usar em dispositivos móveis:** disponibilizar as funções de busca, consulta e troca de unidade em telas móveis.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** a interface deve adaptar o conteúdo e os controles a dispositivos móveis, sem perda das funções principais.
- **RNF-02 — Usabilidade:** busca, seleção de cidade e troca de unidade devem ser compreensíveis e operáveis por toque.
- **RNF-03 — Legibilidade:** informações meteorológicas e unidades devem ser apresentadas de forma clara nos tamanhos de tela suportados.
- **RNF-04 — Confiabilidade dos dados:** as consultas devem apresentar dados associados à cidade selecionada e indicar adequadamente quando não for possível obtê-los.

Os níveis de suporte a navegadores, desempenho, disponibilidade, acessibilidade e atualização dos dados precisam ser definidos antes de se tornarem critérios verificáveis.

## Riscos

- **Ambiguidade geográfica:** nomes de cidades podem corresponder a vários locais; uma seleção incorreta pode mostrar dados de outra cidade.
- **Dependência de dados externos:** indisponibilidade, atraso ou limites do provedor podem impedir ou degradar as consultas.
- **Interpretação da previsão:** “cinco dias” não esclarece se a previsão é diária ou horária, nem como tratar o dia atual.
- **Experiência móvel insuficiente:** controles ou conteúdo que não se ajustem a telas pequenas podem dificultar a consulta.
- **Expectativas não definidas:** sem critérios de atualização, precisão, unidades adicionais e suporte a localização, usuários podem esperar funções fora do escopo atual.

## Perguntas em Aberto

1. Quem são os usuários-alvo e em quais regiões a aplicação deve operar?
2. A busca deve aceitar apenas nomes de cidades ou também estados, países, códigos postais e localização atual do dispositivo?
3. Como o usuário deve distinguir e selecionar resultados com nomes iguais (por exemplo, exibindo estado e país)?
4. A previsão de cinco dias (hoje mais quatro dias) deve ser diária ou horária?
5. Quais informações devem aparecer no clima atual e na previsão (por exemplo, sensação térmica, condição, precipitação, vento e umidade)?
6. A unidade escolhida deve persistir localmente entre sessões? A alternância afeta apenas temperatura ou também outras medidas?
7. Quais são os requisitos de atualização, disponibilidade e atribuição dos dados do Open-Meteo?
8. Quais navegadores, tamanhos de tela, requisitos de acessibilidade e metas de desempenho devem ser suportados?
9. Como a aplicação deve se comportar quando a busca não encontra resultados, a rede falha ou os dados estão indisponíveis?

## Suposições

- A busca e a seleção de uma cidade precedem a exibição dos dados meteorológicos.
- A previsão deve corresponder ao local selecionado pelo usuário.
- A troca entre Celsius e Fahrenheit modifica a apresentação da temperatura, sem alterar os dados meteorológicos subjacentes.
- O suporte móvel significa que as funções principais estarão disponíveis em uma interface responsiva; não implica, por si só, a criação de um aplicativo nativo.
- Não se presume localização automática, histórico de buscas, alertas, funcionamento offline ou suporte a unidades além das de temperatura indicadas no briefing.
