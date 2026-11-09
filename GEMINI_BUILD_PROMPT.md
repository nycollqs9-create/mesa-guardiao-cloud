# PROMPT PARA GOOGLE AI STUDIO BUILD — MESA DO GUARDIÃO

Anexe este ZIP ao projeto novo do Google AI Studio Build e use as instruções abaixo.

---

## OBJETIVO

Analise o ZIP anexado por inteiro antes de começar a construir. Ele contém o código-fonte de uma versão anterior da **Mesa do Guardião**, materiais de referência de Monstro da Semana, tipos de dados, movimentos, cartilhas, telas antigas e uma lista de correções já feitas.

Crie uma nova versão funcional do aplicativo **Mesa do Guardião**, dedicada a jogar campanhas do RPG **Monstro da Semana**, em português brasileiro. O produto deve ser reconstruído com uma arquitetura limpa e mobile-first. O ZIP é a referência de funcionalidades, regras e identidade visual; não copie cegamente o layout antigo nem repita seus erros.

**Prioridade absoluta: celular Android, orientação vertical.** Não desenhe a experiência pensando primeiro em computador. A tela-base de projeto deve ser 360 × 800 px, mas precisa funcionar também em 320 × 800, 390 × 844, 412 × 915 e 430 × 932 px.

O grupo típico tem **1 Guardião + 4 ou 5 Caçadores**. Permita até **6 participantes simultâneos no total** por campanha, contando o Guardião. Não dependa de plano premium, assinatura, anúncios ou pagamentos dentro do aplicativo. Use serviços compatíveis com planos gratuitos quando possível, mas não prometa hospedagem gratuita para sempre: deixe explícito qualquer limite de banco, armazenamento, tráfego ou hospedagem que dependa do provedor.

## COMO USAR O ZIP

Antes de criar telas:

1. Leia o README e os arquivos em `docs/`.
2. Leia também o briefing original em `public/assets/aistudio/Paste_November_08__2026_-_3_35PM_a1b4f577`; ele contém detalhes adicionais sobre arcos, bibliotecas, filas de cenas, progressão e controles de sessão. Use os requisitos funcionais desse briefing, mas ignore suas instruções antigas de priorizar desktop/tablet: a prioridade atual é celular Android.
3. Examine `src/types/motw.ts` para entender entidades e papéis.
4. Examine `src/data/motwPlaybooks.ts`, `src/data/motwBasicMoves.ts` e `src/data/keeperReference.ts` para conhecer as cartilhas, movimentos e ferramentas do Guardião já modelados.
5. Examine `src/utils/dice.ts` e `src/game/rules.test.ts` para compreender as regras de cálculo e os testes existentes.
6. Examine os componentes antigos para identificar as funções imaginadas e os fluxos existentes, mas **não copie as proporções, a navegação ou os espaçamentos antigos**.
7. Examine as capturas mobile apenas como referência de identidade e funcionalidades, não como layout obrigatório.

Os PDFs fornecidos pelo proprietário são referências privadas. Não disponibilize esses PDFs dentro do app, não crie uma biblioteca pública para baixá-los e não reproduza longos trechos protegidos. Use apenas o necessário para conferir mecânicas e terminologia. Prefira textos de interface originais, descrições curtas e resumos mecânicos. Não invente regras ou movimentos ausentes.

## EXPERIÊNCIA E IDENTIDADE VISUAL

- Interface inteira em português brasileiro.
- Atmosfera de investigação paranormal, mistério, suspense e horror urbano.
- Paleta: preto/carvão e grafite; detalhes âmbar/dourado; vermelho escuro para perigo, dano ou ações críticas.
- Aparência profissional e imersiva, mas organizada e legível. Evite excesso de bordas, fontes minúsculas, painéis estreitos ou muitos elementos na mesma linha.
- Use cartões com hierarquia clara, imagens grandes quando forem narrativamente importantes e botões com rótulos compreensíveis.
- Não transforme a interface em uma versão desktop espremida. Use uma navegação móvel própria, áreas de conteúdo empilhadas e painéis que abrem em telas completas ou gavetas.
- Use `100dvh` e safe areas do Android corretamente. Não bloqueie o zoom, seleção de texto, teclado ou rolagem necessária.
- Alvos de toque de pelo menos 44–48 px/dp; texto comum preferencialmente 14–16 px; contraste legível.
- Evite rolagem horizontal da página. Carrosséis horizontais só quando forem intencionais e claramente sinalizados.
- Toda página extensa e todo modal devem ter rolagem vertical própria, sem esconder botões atrás da barra inferior ou do teclado.

## ESTRUTURA DO APLICATIVO

### 1. Entrada e perfil

- Tela inicial simples com o nome Mesa do Guardião e uma explicação curta.
- Cadastro/login ou mecanismo de autenticação real.
- Perfil com nome de exibição e foto/avatar.
- Não use `localStorage` como autenticação. A identidade deve vir de uma sessão autenticada verificável.
- Permita que a pessoa entre com um link/código de convite.

### 2. Hub de campanhas

O Hub é a tela de entrada depois do login.

- Lista de campanhas do usuário com capa, nome, sinopse curta, nome do Guardião, quantidade de participantes e estado (ativa/arquivada).
- Criar campanha como Guardião.
- Entrar em campanha usando código de convite.
- Abrir campanha.
- Editar nome, sinopse e imagem da campanha (somente Guardião responsável).
- Arquivar/reativar campanha.
- Sair de uma campanha como Caçador.
- Excluir campanha com confirmação forte, somente pelo Guardião responsável.
- Mostrar estados vazios, carregamento, erro e sucesso.
- Impedir a entrada de participantes acima do limite de 6 no total. Mostrar claramente quantas vagas restam.

### 3. Sala da campanha / mesa de jogo

O participante entra na mesma campanha que os demais e vê atualizações em tempo real.

Navegação inferior fixa, compacta e adequada ao celular, com cinco ações:

1. **Cena:** imagem/cenário ativo e texto narrativo.
2. **Painel:** caçadores, fichas, mistério, ameaças e pistas que foram reveladas.
3. **Dados:** ação central destacada para abrir o sistema 2d6.
4. **Chat:** mensagens da campanha e avisos.
5. **Central / Minha ficha:** abrir a Central do Guardião para o Guardião ou a ficha/mesa do Caçador para o jogador.

A barra inferior precisa respeitar a safe area do aparelho, nunca cobrir conteúdo e não pode ter espaços inferiores duplicados em cada painel.

### 4. Fichas prontas e criação de Caçador

Use as definições de cartilhas existentes no arquivo `src/data/motwPlaybooks.ts` como referência para oferecer as opções que já estão definidas no projeto. Não crie cartilhas fictícias para completar listas.

A criação deve ser guiada, simples e confortável no celular, em etapas curtas:

- Escolha da cartilha.
- Escolha de uma distribuição de atributos permitida.
- Nome, pronomes opcionais, aparência, breve descrição e retrato.
- Escolha dos movimentos iniciais permitidos pela cartilha.
- Característica especial e opções específicas da cartilha.
- Armas, equipamentos e anotações.
- Vínculos com outros Caçadores.
- Revisão final antes de salvar.

Ficha visual do Caçador:

- Retrato, nome, jogador e cartilha.
- Cinco atributos: Braveza, Esperteza, Estranheza, Firmeza e Sutileza.
- Movimentos escolhidos e movimentos avançados desbloqueados.
- Ferimentos/dano, estado instável, armadura e Sorte.
- Experiência, progresso e melhorias disponíveis.
- Armas, equipamento, vínculos e notas pessoais.
- O jogador pode editar a própria ficha; o Guardião pode visualizar as fichas da campanha e administrar apenas o que as regras do sistema permitirem.
- Ficha deve ser visualmente fácil de ler em celular: seções recolhíveis, indicadores grandes e sem tabela larga.

### 5. Sistema de dados 2d6 compartilhado

- Dois dados de seis faces.
- Selecionar movimento, atributo correspondente e modificador situacional.
- Permitir descrição curta da ação antes de rolar.
- Exibir os dois resultados individuais, soma, modificadores, total e classificação.
- Faixas mecânicas representadas pelo código de referência: até 6 = falha; 7–9 = sucesso parcial; 10 ou mais = sucesso; 12 ou mais = sucesso avançado somente quando o movimento avançado correspondente estiver desbloqueado.
- Registrar falha/experiência conforme a regra aplicável.
- Resultado da rolagem aparece no histórico para todos os membros autorizados da campanha em tempo real, com nome do jogador, nome do Caçador, movimento, dados, modificadores e resultado.
- Permitir modalidades de visibilidade: pública, privada, cega e individual. Defina a semântica no produto e mostre para quem cada modo será visível antes da rolagem. A privacidade deve ser garantida no backend, não apenas escondendo a mensagem da tela.
- O Guardião pode ver o que as regras permitem. Jogadores não podem consultar resultados privados de outros participantes.
- A rolagem precisa funcionar sem abrir uma tela gigante que esconda a campanha inteira; prefira bottom sheet ou modal de altura limitada com rolagem interna.

### 6. Sorte, dano e experiência

- Sorte deve ter um contador persistente com limite configurado pela regra da cartilha.
- A ação de gastar Sorte deve pedir confirmação e registrar quem gastou, quando e por qual efeito.
- Ao atingir o limite, aplicar o estado previsto pelas regras e mostrar aviso compreensível.
- Ferimentos/dano e armadura devem ser atualizados de forma consistente e sincronizados.
- Mostrar estado instável e os limites relevantes sem depender apenas de cor.
- Experiência deve ser persistente, com histórico de alterações e fluxo de melhoria de nível.
- Validar todos os cálculos com `src/utils/dice.ts`, `src/game/rules.test.ts` e os materiais fornecidos. Corrigir inconsistências encontradas e acrescentar testes.

### 7. Preparação de cenários e apresentação narrativa

O Guardião precisa preparar cenas antes da sessão e apresentá-las aos jogadores durante a campanha.

Cada cena deve permitir:

- Nome/título.
- Descrição narrativa editável.
- Imagem de cenário enviada pelo celular (galeria/câmera) ou escolhida de imagens do próprio usuário.
- Texto privado do Guardião.
- Estado: rascunho, preparada, ativa ou arquivada.
- Marcação de cena secreta.
- Lista de pistas associadas.
- Botão claro **Apresentar aos Caçadores** / **Revelar cena**.
- Botão para encerrar ou trocar a cena ativa.

Quando o Guardião apresenta a cena, todos os membros recebem a imagem e a descrição em tempo real. Notas privadas nunca são enviadas à conta dos jogadores.

### 8. Mistérios, ameaças, monstros e NPCs

Central do Guardião com organização de mistérios:

- Título, conceito, gancho inicial, estado do mistério e notas privadas.
- Biblioteca de mistérios: ideia, rascunho, preparado, em andamento, resolvido e arquivado.
- Relógio de contagem regressiva com os estágios definidos nos dados de referência do projeto.
- Ações claras para avançar e reverter estágio, com confirmação/feedback.
- Ameaças separadas por tipo: monstro, lacaio, espectador ou local.
- Cada ameaça pode ter nome, retrato/imagem, motivação, aparência, descrição, poderes, fraquezas, ataques, armadura, dano e movimentos próprios.
- O Guardião pode preparar várias ameaças antes da sessão e vincular ao mistério.
- Informações secretas ficam exclusivamente na área privada do Guardião até serem reveladas.

### 9. Planejamento avançado de arcos, bibliotecas e fila de cenas

- Permita criar arcos narrativos com conceito, objetivo, tema, antagonistas, ameaças relacionadas, mistérios ligados, eventos importantes, segredos, consequências, notas privadas e estado.
- Mostre os mistérios relacionados a cada arco e uma linha do tempo dos acontecimentos importantes.
- Tenha uma biblioteca de cenas preparadas, com criação, edição, duplicação, exclusão, arquivamento e reordenação.
- Crie uma fila privada de próximas cenas. O Guardião pode reordenar ou ativar qualquer cena, sem obrigar uma sequência linear.
- Tenha uma biblioteca reutilizável de monstros, lacaios, espectadores/NPCs e locais; permita duplicar modelos e relacioná-los a várias cenas e mistérios.
- Separe claramente preparação privada e mesa ao vivo. Criar ou editar um item na biblioteca não deve revelá-lo automaticamente.
- Na mesa ao vivo, ofereça ações rápidas: ativar cena, revelar pista, publicar anúncio narrativo, avançar ou reverter o relógio, aplicar dano, conceder XP, abrir ficha e criar ameaça rápida.

### 10. Pistas e evidências

- Criar pistas com título, descrição e imagem opcional.
- Estados: oculta, disponível, revelada e descoberta.
- Permitir revelar para todos ou para Caçadores específicos.
- Associar pista a uma cena e/ou mistério.
- Guardar quem descobriu e quando.
- Jogadores só recebem pistas para as quais têm permissão.

### 11. Chat, diário e sessões

- Chat da campanha em tempo real, com identificação do autor e horário.
- Mensagens públicas e privadas conforme permissão.
- Mensagens de sistema para entrada/saída e mudanças importantes.
- O Guardião pode publicar avisos narrativos.
- Diário de campanha com categorias e opção de compartilhar ou manter privado.
- Histórico de sessões com número, título, data, resumo e experiência concedida.
- Histórico de rolagens pesquisável/filtrável sem expor conteúdo privado.
- Caderno pessoal privado e quadro de investigação compartilhado apenas com pistas reveladas, suspeitos, teorias e relações entre acontecimentos.

## 12. SEGURANÇA E DADOS — NÃO NEGOCIÁVEL

O projeto antigo tem riscos de segurança documentados em `docs/ALTERACOES_FEITAS_E_PONTOS_PENDENTES.md`. Não repita o padrão de confiar em `userId`, `keeperId` ou papel enviados pelo navegador.

- Use autenticação real. Toda operação deve associar o usuário autenticado do backend ao membro da campanha.
- Todas as operações devem verificar membership e role no servidor ou por regras de segurança testáveis do provedor.
- Apenas o Guardião proprietário pode editar detalhes da campanha, mistérios, notas privadas, cenas privadas, ameaças e contagem regressiva.
- Caçadores só podem editar a própria ficha e os dados explicitamente permitidos.
- Separe dados públicos dos privados. Exemplo: mantenha notas do Guardião em documentos/subcoleções com leitura exclusiva do Guardião; não envie esses campos no documento público e tente escondê-los apenas com CSS.
- Listeners em tempo real, notificações, endpoints, exportações e histórico também precisam filtrar por permissão.
- Teste que um Caçador não consegue ler `gmNotes`, `keeperNotes`, ameaças secretas ou pistas não reveladas mesmo tentando acessar diretamente a API/banco.
- Convites devem usar códigos aleatórios difíceis de adivinhar, com validação e limitação de tentativas.
- Uploads devem validar tipo real e tamanho, limitar dimensões/armazenamento, exigir autenticação e evitar salvar imagens gigantes em base64 no documento principal.
- Use armazenamento persistente. Não dependa de arquivos JSON locais, variáveis do navegador ou do disco temporário da hospedagem para salvar campanhas e imagens.
- Não exponha chaves de API no frontend. Não adicione integrações de IA pagas ou chamadas Gemini que não sejam necessárias ao funcionamento da mesa.
- Se a plataforma escolhida não permitir implementar autenticação, regras e persistência com segurança, informe isso e não apresente o app como pronto para multiplayer público.

Prefira uma solução integrada ao Google (Firebase Authentication, Firestore e Storage) caso esteja disponível e caiba nos limites gratuitos reais do projeto. Se não estiver disponível, proponha uma alternativa equivalente compatível com o ambiente atual. Antes de finalizar, liste os limites gratuitos reais do provedor escolhido e qualquer necessidade de configuração do proprietário. Não prometa gratuidade eterna de infraestrutura.

## DADOS E ARQUITETURA

Modele pelo menos: usuários, campanhas, membros da campanha, fichas de Caçadores, cartilhas, movimentos, cenas, mistérios, ameaças, pistas, rolagens, mensagens, entradas de diário, sessões e arquivos de mídia.

Toda entidade ligada à campanha deve ter `campaignId`. Todo registro editável deve ter timestamps e autor/owner quando apropriado. Defina claramente quais coleções são públicas aos participantes e quais são privadas ao Guardião. A sincronização deve ser em tempo real e os dados precisam persistir depois de atualizar a página, fechar o navegador ou trocar de celular.

Não misture dados de campanhas diferentes. Não use a campanha de demonstração do ZIP como dado real do usuário. Inicie com Hub vazio e ofereça uma campanha de exemplo claramente marcada como demonstração, opcional e removível.

## TESTES DE ACEITAÇÃO OBRIGATÓRIOS

Antes de dizer que terminou, executar ou criar testes verificáveis para:

1. Criar usuário, criar campanha e convidar pessoas por código.
2. Entrar com 1 Guardião + 5 Caçadores; bloquear o 7º participante total com mensagem clara.
3. Dois celulares verem a mesma cena e a mesma rolagem pública quase em tempo real.
4. Um jogador criar ficha, atualizar atributos/campos permitidos e ver a atualização depois de recarregar.
5. Guardião criar cena com imagem e descrição, manter notas secretas e revelar a cena para todos.
6. Guardião criar monstro, imagem, poderes, fraqueza e notas privadas.
7. Criar pista oculta, revelar a todos e também testar revelação apenas a um Caçador.
8. Confirmar que um Caçador não consegue acessar notas, cenas, ameaças, pistas, rolagens ou mensagens privadas de outros usuários por API, banco, listener ou URL direta.
9. Testar cada modo de visibilidade de rolagem e chat.
10. Confirmar persistência após recarregar, sair e entrar de novo.
11. Testar criação/edição de campanha, arquivo, saída e exclusão com permissões corretas.
12. Testar as telas nas larguras 320, 360, 390, 412 e 430 px: sem cortes, sobreposição, rolagem horizontal acidental ou botões sob a navegação.
13. Testar teclado virtual aberto, safe areas, modais longos e rolagem interna.

## ENTREGA

Construa um MVP funcional completo, não apenas uma demonstração visual. Não deixe botões sem ação, telas vazias que fingem estar prontas, dados simulados como se fossem reais ou funcionalidades descritas mas não implementadas.

Ao terminar, apresente:

1. O que foi implementado.
2. Como entrar como Guardião e convidar Caçadores.
3. Quais dados e serviços externos foram configurados.
4. Limites do plano gratuito da infraestrutura escolhida.
5. Testes executados e resultados reais.
6. O que ainda falta configurar ou corrigir.

Comece inspecionando o ZIP anexado e, em seguida, implemente o aplicativo. Não espere que eu repita os requisitos já descritos.
